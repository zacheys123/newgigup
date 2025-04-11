import SidebarNav from "@/components/gig/SideBarNav";
import PagesNav from "@/components/pages/PagesNav";
import { Toaster } from "sonner";

type GigLayoutProps = {
  children: React.ReactNode;
  editpage: React.ReactNode;
};

export default function GigLayout({ children, editpage }: GigLayoutProps) {
  return (
    <div className="bg-black min-h-screen w-full flex">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          classNames: {
            toast: "!bg-gray-800 !border !border-gray-700 !text-white",
            title: "!font-medium",
            actionButton: "!bg-blue-600 !text-white",
          },
        }}
      />
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-[150px] lg:ml-[200px] w-full transition-all duration-300">
        {editpage}
        <main className="flex-1 overflow-auto w-full pb-20">
          {" "}
          {/* Increased padding-bottom */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            {children}
          </div>
        </main>
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <PagesNav />
        </div>
      </div>
    </div>
  );
}
