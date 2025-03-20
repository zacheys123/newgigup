import PagesNav from "@/components/pages/PagesNav";
import { Toaster } from "sonner";

type GigLayoutProps = {
  children: React.ReactNode;
  editpage: React.ReactNode;
};

export default function GigLayout({ children, editpage }: GigLayoutProps) {
  return (
    <div className="bg-black h-screen w-full flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {editpage}
      <div className="flex-1 overflow-auto">{children}</div>
      <PagesNav />
    </div>
  );
}
