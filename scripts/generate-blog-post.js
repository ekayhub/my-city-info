const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    // [1단계] 최신 데이터 확인
    const dataFilePath = path.resolve(__dirname, '../public/data/city-info.json');
    if (!fs.existsSync(dataFilePath)) {
      throw new Error('city-info.json 파일을 찾을 수 없습니다.');
    }

    const cityData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    if (!Array.isArray(cityData) || cityData.length === 0) {
      console.log('city-info.json에 데이터가 없습니다.');
      return;
    }

    // 배열의 마지막 항목(최신 추가 항목) 가져오기
    const latestItem = cityData[cityData.length - 1];
    const targetName = (latestItem.name || '').trim();

    const postsDir = path.resolve(__dirname, '../src/content/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // 기존 블로그 글과 중복 여부 확인
    const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
    for (const file of existingFiles) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      if (targetName && (content.includes(targetName) || content.toLowerCase().includes(targetName.toLowerCase()))) {
        console.log('이미 작성된 글입니다');
        return;
      }
    }

    // 오늘 날짜 계산 (YYYY-MM-DD)
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    // [2단계] Gemini AI로 블로그 글 생성
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.
정보: ${JSON.stringify(latestItem, null, 2)}
아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---
(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status} ${errBody}`);
    }

    const geminiResult = await geminiResponse.json();
    const rawText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API 응답에서 내용을 찾을 수 없습니다.');
    }

    // [3단계] 파일 저장 및 파싱
    let text = rawText.trim();
    text = text.replace(/^```(?:markdown|md)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // 파일명 추출
    const filenameMatch = text.match(/FILENAME:\s*([a-zA-Z0-9_\-]+(?:\.md)?)/i);
    let filename = '';
    if (filenameMatch) {
      filename = filenameMatch[1].trim();
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }
    } else {
      filename = `${today}-post.md`;
    }

    // 본문에서 FILENAME 줄 분리 및 제거
    let postContent = text.replace(/FILENAME:\s*[^\n\r]+/i, '').trim();

    // frontmatter 시작 형식 확인 보정
    if (!postContent.startsWith('---') && postContent.startsWith('title:')) {
      postContent = '---\n' + postContent;
    }

    const targetFilePath = path.join(postsDir, filename);
    fs.writeFileSync(targetFilePath, postContent + '\n', 'utf-8');

    console.log(`블로그 글이 성공적으로 생성되었습니다: ${filename}`);
  } catch (error) {
    console.error('오류 발생:', error.message);
    process.exit(1);
  }
}

main();
