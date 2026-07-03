import { getAllPostsMeta } from "@/lib/posts";
import Nav from "../components/Nav";
import BlogPostList from "../components/BlogPostList";

export default async function BlogPage() {
  const posts = await getAllPostsMeta();

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,#2b1a12_0%,#0b0b0c_70%)] py-6 text-white"
      id="main-content"
    >
      <Nav />

      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#f5c26b]">REJU Blog</h1>
          <p className="text-xl text-gray-400">
            Insights on transparent crypto, long-term ecosystems — and health and rejuvenation.
          </p>
        </div>

        <BlogPostList posts={posts} />
      </div>
    </main>
  );
}