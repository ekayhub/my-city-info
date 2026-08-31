import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-purple-50/30 to-sky-50/40 font-sans text-stone-800 pb-20">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-20 border-b border-purple-100/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-200/80 text-purple-700 shadow-sm transition-transform group-hover:scale-105">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight sm:text-2xl bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                성남시 생활 정보
              </h1>
              <p className="text-[10px] text-stone-500 sm:text-xs font-medium">우리 동네 소소하고 따뜻한 소식지</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-stone-600 hover:text-purple-600 transition-colors">
              홈
            </Link>
            <Link href="/blog" className="text-sm font-bold text-purple-600 border-b-2 border-purple-500 pb-1 transition-colors">
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:pt-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mb-3">
            따뜻한 소식 & 정보 블로그
          </h2>
          <p className="text-stone-500 text-sm sm:text-base font-light">
            성남시의 소소한 이야기와 유용한 꿀팁을 전해드립니다.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-purple-100/50 shadow-sm">
            <span className="text-4xl mb-4 block">✍️</span>
            <h3 className="text-lg font-bold text-stone-800 mb-1">아직 등록된 글이 없습니다.</h3>
            <p className="text-stone-500 text-sm">첫 번째 글이 등록될 예정이니 조금만 기다려주세요!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-2xl border border-stone-200/40 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/40 hover:border-purple-200/40"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {post.category && (
                    <span className="rounded-lg bg-purple-50 border border-purple-100/70 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                      {post.category}
                    </span>
                  )}
                  <span className="text-xs text-stone-400 font-semibold">{post.date}</span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block group">
                  <h3 className="text-xl font-bold text-stone-950 mb-3 tracking-tight group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-stone-500 leading-relaxed font-light mb-6 line-clamp-3">
                  {post.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100/60">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    더 읽어보기 <span className="text-[10px]">➔</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
