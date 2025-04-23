import ChatNavigation from "@/components/chat/mainchats/ChatNavigation";
import NotificationHandler from "@/components/NotificationHandler";
import { Toaster } from "sonner";

export default function NoHeadersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      <ChatNavigation />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <NotificationHandler />
      {children}
    </div>
  );
}
