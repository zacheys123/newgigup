"use client";
import { useAuth } from "@clerk/nextjs";
import useStore from "@/app/zustand/useStore";

// import { debounce } from "@/utils/debounce";
import { searchFunc } from "@/utils";
import { UserProps } from "@/types/userinterfaces";
import MainUser from "./MainUser";
import { useAllUsers } from "@/hooks/useAllUsers";

const SearchComponent = () => {
  const { userId } = useAuth();
  const {
    //  searchedUser,
    searchQuery,
    // setViewGig,
    // SetSearchedUser
  } = useStore();
  const { users } = useAllUsers();
  // const handleSendNotification = useCallback(
  //   (myuser: UserProps) => {
  //     if (!myuser) {
  //       console.log("User not found");
  //     } else {
  //       // SetSearchedUser(myuser);
  //       setViewGig(true);
  //     }
  //   },
  //   [setViewGig]
  // );

  return (
    <>
      {/* <GigsModal /> */}

      <div className="bg-black w-[100vw] h-[calc(100vh-80px)] lg:hidden overflow-hidden">
        <div className="overflow-y-auto h-full w-full my-4 py-10 space-y-4">
          {users &&
            searchFunc(users?.users, searchQuery)
              .filter((user: UserProps) => user.clerkId !== userId)
              .map((user: UserProps) => (
                <MainUser
                  key={user._id}
                  {...user}
                  //   handleSendNotification={() => handleSendNotification(user)}
                />
              ))}
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
