// import { getAuth } from "@clerk/nextjs";
import { Toaster } from "sonner";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          className: "toast",
        }}
      />

      {children}
    </div>
  );
};

export default MainLayout;
