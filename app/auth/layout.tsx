import MobileSheet from "@/components/pages/MobileSheet";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";

type SearchProps = {
  children: React.ReactNode;
  editpage: React.ReactNode;
};

export default function Search({ children, editpage }: SearchProps) {
  return (
    <div className="bg-black min-h-screen w-full ">
      <div className="flex items-center justify-between p-5">
        <MobileSheet />
        <UserButton />
      </div>
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

      <div className="flex-1 flex flex-col md:ml-[150px] lg:ml-[200px] w-full transition-all duration-300">
        {editpage}
        <main className="h-[100%] overflow-auto w-full relative ">
          {" "}
          {/* Even more padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
