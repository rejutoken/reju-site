import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getAllPosts();

const links = {
  home: "/",
  buy: "/buy",
  onboarding: "/onboarding",
  program: "/program",
  rejunomics: "/rejunomics",
  blog: "/blog",
  telegramOfficial: "https://t.me/rejuofficial",
};

  const cryptoPosts = posts.filter(p => p.category === 'crypto');
  const healthPosts = posts.filter(p => p.category === 'health');

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_center,#2b1a12_0%,#0b0b0c_70%)] text-white py-6">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6  text-sm">
  <a href={links.home} className="font-bold text-[#f5c26b]">
    REJU
  </a>

  <div className="flex flex-wrap justify-center gap-6 text-md text-gray-300">
    <a href={links.buy} className="hover:text-[#f5c26b]">Buy REJU</a>
    <a href="/#tokenomics" className="hover:text-[#f5c26b]">Tokenomics</a>
    <a href={links.rejunomics} className="hover:text-[#f5c26b]">Rejunomics</a>
    <a href={links.blog} className="hover:text-[#f5c26b]">Blog</a>
    <a href={links.program} className="hover:text-[#f5c26b]">Program</a>
    <a href={links.onboarding} className="hover:text-[#f5c26b]">Onboarding</a>
    <a
      href={links.telegramOfficial}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-[#f5c26b]"
    >
      Telegram
    </a>
  </div>
</nav>
	  	  
	  
	  <div className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#f5c26b] mb-4">REJU Blog</h1>
          <p className="text-xl text-gray-400">
            Insights on transparent crypto, long-term ecosystems - AND - health and rejuvenation, 
          </p>
        </div>

        {/* Crypto Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-[#f5c26b] mb-8 border-b border-[#f5c26b]/20 pb-4">
            Crypto & Token
          </h2>
          <div className="grid md:grid-cols-1">
            {cryptoPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="border border-[#f5c26b]/20 bg-[#120904]/80 p-8 rounded-3xl hover:border-[#f5c26b] transition-all h-full">
                  <p className="text-md text-gray-500 mb-4">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-[#f5c26b]">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-md line-clamp-3">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
	
        </section>

        {/* Health Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#f5c26b] mb-8 border-b border-[#f5c26b]/20 pb-4">
            Health & Rejuvenation
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            {healthPosts.length > 0 ? (
              healthPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="border border-[#f5c26b]/20 bg-[#120904]/80 p-8 rounded-3xl hover:border-[#f5c26b] transition-all h-full">
                    <p className="text-md text-gray-500 mb-4">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-[#f5c26b]">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-3">{post.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 col-span-2">Health & Rejuvenation articles coming soon.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}