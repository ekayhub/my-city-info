import Link from "next/link";
import cityData from "../../public/data/city-info.json";

interface InfoItem {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

export default function Home() {
  const items = cityData as InfoItem[];

  // 카테고리별 데이터 필터링
  const events = items.filter((item) => item.category === "행사/축제");
  const benefits = items.filter((item) => item.category === "지원금/혜택");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-purple-50/30 to-sky-50/40 font-sans text-stone-800 pb-20">
      
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-20 border-b border-purple-100/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-200/80 text-purple-700 shadow-sm">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight sm:text-2xl bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                성남시 생활 정보
              </h1>
              <p className="text-[10px] text-stone-500 sm:text-xs font-medium">우리 동네 소소하고 따뜻한 소식지</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50/80 border border-purple-100/60 px-3 py-1 text-xs font-bold text-purple-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            새 소식
          </span>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:pt-16">
        
        {/* 이번 달 행사 / 축제 섹션 */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between border-b border-purple-100/50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎈</span>
              <h2 className="text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
                이번 달 행사 / 축제
              </h2>
            </div>
            <span className="rounded-full bg-amber-100/70 px-3 py-0.5 text-xs font-bold text-amber-800 shadow-inner">
              {events.length}건
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/info/${event.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-200/50 cursor-pointer"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-lg bg-amber-50 border border-amber-100/70 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                      {event.category}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold inline-flex items-center gap-1">
                      <span>📍</span> {event.location}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-stone-800 tracking-tight transition-colors group-hover:text-purple-500">
                    {event.name}
                  </h3>
                  <p className="mb-4 text-sm text-stone-500 leading-relaxed font-light line-clamp-3">
                    {event.summary}
                  </p>
                </div>
                
                <div className="mt-4 border-t border-stone-100/60 pt-4">
                  <div className="mb-1.5 text-xs text-stone-500 flex justify-between">
                    <span className="font-semibold text-stone-500">일정</span>
                    <span className="font-medium text-stone-800">{event.startDate} ~ {event.endDate}</span>
                  </div>
                  <div className="mb-4 text-xs text-stone-500 flex justify-between">
                    <span className="font-semibold text-stone-500">대상</span>
                    <span className="font-medium text-stone-800">{event.target}</span>
                  </div>
                  <div
                    className="inline-flex w-full items-center justify-center rounded-xl bg-purple-300/80 py-3 text-xs font-bold text-purple-800 group-hover:bg-purple-300 shadow-sm active:scale-[0.98] transition-all"
                  >
                    자세히 보기
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 지원금 / 혜택 정보 섹션 */}
        <section className="mb-12">
          <div className="mb-8 flex items-center justify-between border-b border-purple-100/50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
                지원금 / 혜택 정보
              </h2>
            </div>
            <span className="rounded-full bg-sky-100/70 px-3 py-0.5 text-xs font-bold text-sky-800 shadow-inner">
              {benefits.length}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Link
                key={benefit.id}
                href={`/info/${benefit.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100/50 hover:border-sky-200/50 cursor-pointer"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-lg bg-sky-50 border border-sky-100/70 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                      {benefit.category}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold inline-flex items-center gap-1">
                      <span>📍</span> {benefit.location}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-stone-800 tracking-tight transition-colors group-hover:text-sky-500">
                    {benefit.name}
                  </h3>
                  <p className="mb-4 text-sm text-stone-500 leading-relaxed font-light line-clamp-3">
                    {benefit.summary}
                  </p>
                </div>

                <div className="mt-4 border-t border-stone-100/60 pt-4">
                  <div className="mb-1.5 text-xs text-stone-500 flex justify-between">
                    <span className="font-semibold text-stone-500">대상</span>
                    <span className="font-medium text-stone-800">{benefit.target}</span>
                  </div>
                  <div className="mb-4 text-xs text-stone-500 flex justify-between">
                    <span className="font-semibold text-stone-500">신청 기간</span>
                    <span className="font-medium text-stone-800">상시 (공고 참조)</span>
                  </div>
                  <div
                    className="inline-flex w-full items-center justify-center rounded-xl bg-sky-200/80 py-3 text-xs font-bold text-sky-800 group-hover:bg-sky-200 shadow-sm active:scale-[0.98] transition-all"
                  >
                    혜택 신청하기
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* 하단 푸터 */}
      <footer className="mx-auto mt-24 max-w-6xl px-4 text-center sm:px-6">
        <div className="border-t border-stone-200/40 pt-10 pb-4">
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            데이터 출처: 공공데이터포털 | 마지막 업데이트: 2026년 8월 23일
          </p>
          <p className="mt-2 text-[10px] text-stone-400 font-light">
            본 사이트의 정보는 예시용이며, 정확한 내용은 해당 기관의 공식 공고를 반드시 확인하시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
