import PagesNav from "@/components/pages/PagesNav";
import { Toaster } from "sonner";

export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {children} <PagesNav />
    </div>
  );
}
