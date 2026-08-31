import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostData, getSortedPostsData } from "@/lib/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/40 via-purple-50/30 to-sky-50/40 font-sans text-stone-800 pb-20">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-20 border-b border-purple-100/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-stone-600 hover:text-purple-600 font-bold text-sm transition-colors">
            <span>←</span> 블로그 목록
          </Link>
          <span className="rounded-full bg-purple-50/80 border border-purple-100/60 px-3 py-1 text-xs font-bold text-purple-600 shadow-sm">
            상세 보기
          </span>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <article className="bg-white rounded-2xl border border-stone-200/40 p-6 sm:p-10 shadow-sm">
          {/* 포스트 헤더 */}
          <header className="mb-8 pb-6 border-b border-stone-100">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className="rounded-lg bg-purple-50 border border-purple-100/70 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-stone-400 font-semibold">{post.date}</span>
            </div>
            
            <h1 className="text-2xl font-black text-stone-900 sm:text-3xl lg:text-4xl tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed mb-6">
                {post.summary}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* 포스트 본문 */}
          <div className="prose prose-stone max-w-none prose-headings:font-bold prose-a:text-purple-600 hover:prose-a:text-purple-800 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
