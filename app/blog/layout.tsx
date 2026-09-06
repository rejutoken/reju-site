import Nav from "../components/Nav";

export const dynamic = "force-dynamic";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,#2b1a12_0%,#0b0b0c_70%)] py-6 text-white"
      id="main-content"
    >
      <Nav />
      {children}
    </main>
  );
}
