import { Toaster } from "sonner";

export default function NoHeadersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden relative">
      <div className="absolute left-2 top-5 z-50 text-white ">
        {/* <MobileSheet />
        <UserButton /> */}
        some hanging header
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      {children}
      {/* <PagesNav /> */}
    </div>
  );
}
