

import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from "next/link";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;           // ← This is the important fix
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black py-16">
      <article className="w-full max-w-[1100px] mx-auto px-8">
        <div className="mb-12">
		<Link
  href="/"
  className="text-[#0085ff] hover:text-white transition"
>
  ← Back to REJU
</Link>
          <p className="text-lg text-gray-700 mb-6">
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <h1 className="text-3xl font-bold text-black leading-tight mb-10">
            {post.title}
          </h1>
        </div>

<div
  className="
    max-w-none text-gray-800 leading-relaxed
    [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-5
    [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-10 [&_h3]:mb-4
    [&_p]:text-xl [&_p]:leading-8 [&_p]:mb-6
    [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-8 [&_ul]:space-y-3
    [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-8 [&_ol]:space-y-4
    [&_li]:text-xl [&_li]:leading-8
    [&_strong]:text-black [&_strong]:font-semibold
    [&_a]:text-[#f5c26b] [&_a]:font-semibold [&_a]:underline
  "
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
      </article>
    </main>
  );
}