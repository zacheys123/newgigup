import { getAuth } from "@clerk/nextjs";
import Nav from "@/components/Nav";
import React from "react";
import { checkEnvironment } from "@/utils";

// export const getCurrentUser = async (userId) => {
//   try {
//     const res = await fetch(
//       `${checkEnvironment()}/api/user/getuser/${userId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await res.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// // SSR function to get current user on the server side
// export const getServerSideProps = async ({ req }) => {
//   // Get auth data on the server side
//   const { userId } = getAuth(req); // Use getAuth to fetch the user's auth data
//   if (!userId) {
//     return {
//       redirect: {
//         destination: "/sign-in", // Redirect to login page if not authenticated
//         permanent: false,
//       },
//     };
//   }

//   // Fetch current user data
//   const currentUser = await getCurrentUser(userId);

//   // Fetch chats (assuming you have a function to do so)
//   const chats = await getChats(currentUser?.user?._id);

//   return {
//     props: {
//       currentUser,
//       chats,
//     },
//   };
// };

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen overflow-x-hidden">
      <Nav />
      {children}
    </div>
  );
};

export default MainLayout;
