"use client";
import useStore from "@/app/zustand/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Review, UserProps } from "@/types/userinterfaces";
import { fonts } from "@/utils";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { MdInsertComment } from "react-icons/md";

interface ProfileModalProps {
  user: UserProps;
  getReviews: (reviewdata: Review[]) => void;
}
const RefferenceModal: React.FC<ProfileModalProps> = ({ user, getReviews }) => {
  const router = useRouter();
  const { setRefferenceModalOpen, setReviewModalOpen, setIsProfileModalOpen } =
    useStore();
  const { user: myuser } = useCurrentUser();
  return (
    <div className="bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up min-h-[340px] rounded-tl-[50px] rounded-tr-[50px] pt-12">
      {/* {[...Array(3)].map((i, index) => (
        <div key={index} className="w-full flex justify-center items-center">
          <span className="bg-neutral-400 w-[70%] mx-auto h-[1px] my-1"></span>
        </div>
      ))}{" "} */}
      <div className="w-full flex justify-center items-center flex-col absolute top-1">
        <span className="bg-neutral-600 w-[60%] mx-auto h-[1px] mb-2 rounded-full "></span>

        <span className="bg-neutral-600 w-[60%] mx-auto h-[1px] mb-2 rounded-full "></span>
        <span className="bg-neutral-600 w-[50%] mx-auto h-[1px] mb-2 rounded-full "></span>
      </div>
      <button
        onClick={() => setRefferenceModalOpen(false)}
        className="absolute top-2 right-7 text-gray-300  text-[25px]"
      >
        &times;
      </button>
      <h2
        className="text-2xl font-bold mb-1 text-[20px] text-neutral-300 "
        style={{ fontFamily: fonts[24] }}
      >
        Clients
      </h2>
      <p className="text-neutral-400 mb-3">
        Contact a list of {user?.username} former clients
      </p>
      {myuser?.user?._id &&
        user?.refferences
          ?.filter(({ _id }: UserProps) => _id !== myuser?.user?._id)
          ?.map(
            ({ _id, firstname, lastname, myreviews, username }: UserProps) => {
              return (
                <div
                  key={_id}
                  className="w-full text-white bg-neutral-800  rounded-md py-3 px-3 flex gap-2 items-center justify-between my-1"
                >
                  <div>
                    <span className="text-[15px] font-bold text-neutral-400 mr-2">
                      {firstname}
                    </span>
                    <span className="text-[15px] font-bold text-neutral-400 mr-2">
                      {lastname}
                    </span>
                  </div>
                  <div className="flex items-center h-[35px] w-[75px] justify-between">
                    <div className="bg-neutral-300 p-1 rounded-full flex justify-center items-center">
                      <User
                        className="text-[24px] text-gray-600 "
                        style={{ fontSize: "24px" }}
                        onClick={() => {
                          setRefferenceModalOpen(false);
                          router.push(`/client/search/${username}`);
                        }}
                      />
                    </div>
                    <MdInsertComment
                      className="text-[24px] text-yellow-400"
                      style={{ fontSize: "24px" }}
            onClick={(ev) => {
  ev.stopPropagation();
  setRefferenceModalOpen(false);
  setReviewModalOpen(true);
  if (myreviews) {
    getReviews(myreviews);
  }
}}
                    />
                  </div>
                </div>
              );
            }
          )}

      <div className="absolute bottom-2 left-3 ">
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            setIsProfileModalOpen(true);
            setRefferenceModalOpen(false);
          }}
          className="bg-green-700 text-white px-4  rounded-full hover:bg-[#0e6e5f] transition-colors duration-200"
        >
          back
        </button>
      </div>
    </div>
  );
};

export default RefferenceModal;
