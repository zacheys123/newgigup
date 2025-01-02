import PagesNav from "@/components/pages/PagesNav";

export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      {children} <PagesNav />
    </div>
  );
}
