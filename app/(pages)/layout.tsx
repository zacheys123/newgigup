import PagesNav from "@/components/pages/PagesNav";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Toaster } from "sonner";

export default function GigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      <div className="flex items-center justify-between mt-4 mx-6  ">
        <Menu size="25px" style={{ color: "gray" }} />

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
