import MobileSheet from "@/components/pages/MobileSheet";
import PagesNav from "@/components/pages/PagesNav";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      <div className="flex items-center justify-between mt-4 mx-6  ">
        <MobileSheet />
        <UserButton />
      </div>
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
