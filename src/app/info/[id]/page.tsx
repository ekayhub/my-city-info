import Link from "next/link";
import cityData from "../../../../public/data/city-info.json";

interface InfoItem {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  description: string;
  link: string;
}

// 빌드 시점에 정적 HTML을 만들기 위해 모든 id 경로를 수집하는 함수입니다.
export async function generateStaticParams() {
  return cityData.map((item) => ({
    id: item.id.toString(),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = (cityData as InfoItem[]).find((i) => i.id.toString() === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-purple-50/30 to-sky-50/40 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-md border border-purple-100">
          <span className="text-4xl mb-4 block">😢</span>
          <h2 className="text-xl font-bold text-stone-800 mb-2">정보를 찾을 수 없습니다.</h2>
          <p className="text-stone-500 mb-6 text-sm">올바르지 않은 경로이거나 삭제된 정보입니다.</p>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-purple-300/80 py-3 text-xs font-bold text-purple-800 hover:bg-purple-300 transition-all"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isEvent = item.category === "행사/축제";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-purple-50/30 to-sky-50/40 font-sans text-stone-800 pb-20">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-20 border-b border-purple-100/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-purple-600 font-bold text-sm transition-colors">
            <span>←</span> 목록으로
          </Link>
          <span className="rounded-full bg-purple-50/80 border border-purple-100/60 px-3 py-1 text-xs font-bold text-purple-600 shadow-sm">
            상세 정보
          </span>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <article className="bg-white rounded-3xl border border-stone-200/40 p-6 sm:p-10 shadow-lg shadow-purple-100/40">
          {/* 카테고리 뱃지 */}
          <div className="mb-4">
            <span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold ${
              isEvent 
                ? "bg-amber-50 border border-amber-100/70 text-amber-700" 
                : "bg-sky-50 border border-sky-100/70 text-sky-700"
            }`}>
              {item.category}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-6 leading-tight">
            {item.name}
          </h1>

          {/* 메타 정보 표 */}
          <div className="grid gap-3 sm:grid-cols-3 bg-purple-50/20 rounded-2xl p-5 border border-purple-100/30 mb-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-stone-400 font-semibold text-xs">📍 장소</span>
              <span className="font-bold text-stone-800">{item.location}</span>
            </div>
            <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-purple-100/40 pt-3 sm:pt-0 sm:pl-5">
              <span className="text-stone-400 font-semibold text-xs">📅 기간</span>
              <span className="font-bold text-stone-800">
                {isEvent ? `${item.startDate} ~ ${item.endDate}` : "상시 (공고 참조)"}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-purple-100/40 pt-3 sm:pt-0 sm:pl-5">
              <span className="text-stone-400 font-semibold text-xs">👥 대상</span>
              <span className="font-bold text-stone-800">{item.target}</span>
            </div>
          </div>

          {/* 상세 설명 전문 */}
          <div className="border-t border-stone-100 pt-8 mb-10">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📝</span> 상세 안내
            </h2>
            <p className="text-stone-600 leading-relaxed font-light whitespace-pre-line text-base">
              {item.description || item.summary}
            </p>
          </div>

          {/* 하단 버튼 2개 */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-stone-100 pt-8">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-stone-200 py-3.5 text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all text-center"
            >
              목록으로 돌아가기
            </Link>
            <a
              href={item.link}
              className={`flex-1 inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all text-center active:scale-[0.98] ${
                isEvent
                  ? "bg-amber-400 hover:bg-amber-500 shadow-amber-100 hover:shadow-lg hover:shadow-amber-200"
                  : "bg-sky-400 hover:bg-sky-500 shadow-sky-100 hover:shadow-lg hover:shadow-sky-200"
              }`}
            >
              자세히 보기 →
            </a>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="mx-auto mt-20 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs text-stone-400 font-light">
          본 정보는 예시이며 실제 접수 및 축제 일정 등 상세 내역은 공식 홈페이지에서 확인하시기 바랍니다.
        </p>
      </footer>
    </div>
  );
}
