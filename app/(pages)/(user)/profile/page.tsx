"use client";

// import { getAllUsers } from "@/app/server-actions/getAllUsers";
// import InfoComponent from "@/components/largedevices/InfoComponent";
// import SideBar from "@/components/largedevices/Sidebar";
// import MoreInfoPage from "@/components/userprofile/MoreInfoPage";
import RouteProfile from "@/components/userprofile/RouteProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";

const ProfilePage = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  // const allUsers = await getAllUsers(user?.user?._id);

  console.log(user);
  return (
    <div className="container h-[100vh] w-screen md:w-[70vw]  overflow-auto flex flex-col gap-2">
      <div className="text-2xl text-white mt-[35px]">
        Profile Landing Page
        <br />
        <span className="text-sm text-gray-400">
          Welcome, {user?.firstname}!
        </span>
      </div>
      <RouteProfile />
      {/* <section>
        <MoreInfoPage user={user} allUsers={allUsers} />
      </section> */}
      {/* <div className=" hidden lg:flex w-full md:h-full lg:h-[490px] shadow-xl shadow-slate-700">
        <InfoComponent user={user} allUsers={allUsers} />
        <Divider />
        <SideBar user={user} allUsers={allUsers} />{" "}
      </div> */}
    </div>
  );
};

export default ProfilePage;
