"use client";

import Musicians from "@/components/pages/Musicians";
// import { getAllUsers } from "@/app/server-actions/getAllUsers";
// import InfoComponent from "@/components/largedevices/InfoComponent";
// import SideBar from "@/components/largedevices/Sidebar";
// import MoreInfoPage from "@/components/userprofile/MoreInfoPage";
import RouteProfile from "@/components/userprofile/RouteProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ProfilePage = () => {
  const { user } = useCurrentUser();
  // const allUsers = await getAllUsers(user?.user?.user?.user?._id);

  console.log(user);
  return (
    <div className="container h-[100vh] w-screen md:w-[70vw]  overflow-auto flex flex-col gap-2">
      <div className="text-2xl text-white mt-[35px]  ml-4">
        Profile Landing Page
        <br />
        <span className="text-sm text-gray-400">
          Welcome, {user?.user?.firstname}!
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
      <Musicians {...user?.user} />
    </div>
  );
};

export default ProfilePage;
