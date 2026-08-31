const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // 환경변수 확인
    const appToken = process.env.PUBLIC_DATA_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!appToken) {
      throw new Error('PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    // 1. America/New_York 기준 오늘 날짜 계산 (YYYY-MM-DD)
    const todayInNY = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    console.log(`[기준 일자] America/New_York 오늘 날짜: ${todayInNY}`);

    // [1단계] NYC Open Data (NYC Parks Public Events) API 호출
    const nycDataUrl = 'https://data.cityofnewyork.us/resource/w3wp-dpdi.json?$limit=2000&$order=startdate%20ASC';

    const response = await fetch(nycDataUrl, {
      headers: {
        'X-App-Token': appToken,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 401 || status === 403) {
        throw new Error(
          `NYC Open Data 인증 실패 (상태 코드: ${status}). Socrata App Token이 다른 포털용이거나 권한이 올바르지 않습니다.`
        );
      }
      throw new Error(`NYC Open Data API 호출 실패 (상태 코드: ${status})`);
    }

    const events = await response.json();

    if (!Array.isArray(events) || events.length === 0) {
      console.log('NYC Open Data에서 가져온 이벤트 데이터가 없습니다.');
      return;
    }

    // 2. 종료일(endDate)이 오늘 이전인 지난 이벤트 제외
    const validEvents = events.filter((event) => {
      const endDate = event.enddate
        ? event.enddate.split('T')[0]
        : (event.startdate ? event.startdate.split('T')[0] : '');
      return endDate >= todayInNY;
    });

    // 5. 유효한 현재 또는 미래 이벤트가 없을 경우 종료
    if (validEvents.length === 0) {
      console.log('유효한 현재 또는 향후 이벤트가 없습니다.');
      return;
    }

    // 3. 시작일(startDate) 기준 오름차순 정렬 (가장 빠른 일정 우선)
    validEvents.sort((a, b) => {
      const startA = a.startdate ? a.startdate.split('T')[0] : '';
      const startB = b.startdate ? b.startdate.split('T')[0] : '';
      return startA.localeCompare(startB);
    });

    // [2단계] 기존 데이터와 비교
    const cityDataPath = path.resolve(__dirname, '../public/data/city-info.json');
    const localDataPath = path.resolve(__dirname, '../public/data/local-info.json');

    let existingData = [];
    if (fs.existsSync(cityDataPath)) {
      existingData = JSON.parse(fs.readFileSync(cityDataPath, 'utf-8'));
    } else if (fs.existsSync(localDataPath)) {
      existingData = JSON.parse(fs.readFileSync(localDataPath, 'utf-8'));
    }

    const existingNames = new Set(
      existingData.map((item) => (item.name || '').trim().toLowerCase())
    );

    // 4. 가장 가까운 미등록 예정 이벤트 선택
    const newEvents = validEvents.filter((event) => {
      const title = (event.title || '').trim().toLowerCase();
      return title && !existingNames.has(title) && !existingData.some((d) => (d.name || '').toLowerCase().includes(title));
    });

    if (newEvents.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    const targetEvent = newEvents[0];
    const maxId = existingData.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    const nextId = maxId + 1;

    let processedItem = null;

    // [3단계] Gemini AI로 새 항목 1건 가공
    if (geminiApiKey) {
      try {
        const prompt = `아래 NYC Parks 공공데이터 이벤트 1건을 분석하여 한국어 생활 정보 JSON 객체로 변환해줘.
형식:
{
  "id": ${nextId},
  "name": "행사명 (한국어 번역과 원문 명칭을 자연스럽게 조합)",
  "category": "행사/축제",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "location": "장소 및 공원명",
  "target": "참여 대상 (예: 어린이 동반 가족, 청소년, 시민 누구나 등)",
  "summary": "한국어 한줄 요약 (1~2문장)",
  "description": "한국어로 번역된 상세 행사 안내",
  "link": "이벤트 링크 URL"
}

주의사항:
- category는 '행사/축제' 또는 '지원금/혜택' 중 적합한 것으로 지정 (기본은 '행사/축제').
- startDate, endDate는 YYYY-MM-DD 형식.
- link는 원본 데이터의 link.url 또는 link 값을 사용.
- 반드시 유효한 JSON 객체만 출력하고, 마크다운 코드블록이나 다른 텍스트는 제외해.

[NYC Parks 데이터]
${JSON.stringify(targetEvent, null, 2)}`;

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

        if (geminiResponse.ok) {
          const geminiResult = await geminiResponse.json();
          const rawText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

          if (rawText) {
            let cleaned = rawText.trim();
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }

            processedItem = JSON.parse(cleaned);
            processedItem.id = nextId;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini 변환 실패, 기본 변환 로직으로 진행합니다:', geminiError.message);
      }
    }

    // Gemini 실패 시 기본 매핑
    if (!processedItem) {
      const url = typeof targetEvent.link === 'object' ? targetEvent.link?.url : (targetEvent.link || '#');
      const sDate = targetEvent.startdate ? targetEvent.startdate.split('T')[0] : todayInNY;
      const eDate = targetEvent.enddate ? targetEvent.enddate.split('T')[0] : sDate;

      processedItem = {
        id: nextId,
        name: targetEvent.title || 'NYC Parks Event',
        category: '행사/축제',
        startDate: sDate,
        endDate: eDate,
        location: targetEvent.location || targetEvent.parknames || 'NYC Park',
        target: targetEvent.categories || '시민 누구나',
        summary: targetEvent.description
          ? targetEvent.description.substring(0, 100).replace(/<[^>]*>/g, '')
          : 'NYC Parks 공공 이벤트',
        description: targetEvent.description ? targetEvent.description.replace(/<[^>]*>/g, '') : '',
        link: url
      };
    }

    // [4단계] 데이터 저장
    existingData.push(processedItem);

    if (fs.existsSync(cityDataPath)) {
      fs.writeFileSync(cityDataPath, JSON.stringify(existingData, null, 2), 'utf-8');
    }
    if (fs.existsSync(localDataPath)) {
      fs.writeFileSync(localDataPath, JSON.stringify(existingData, null, 2), 'utf-8');
    }

    console.log(`\n[성공] 새 이벤트가 추가되었습니다:`);
    console.log(`- 제목: ${processedItem.name}`);
    console.log(`- 시작일: ${processedItem.startDate}`);
    console.log(`- 종료일: ${processedItem.endDate}`);
    console.log(`- 장소: ${processedItem.location}`);
    console.log(`- 요약: ${processedItem.summary}`);
  } catch (error) {
    console.error('오류 발생:', error.message);
    process.exit(1);
  }
}

main();
