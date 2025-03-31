"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import ForgotSecret from "@/components/gig/ForgotSecret";
import Gigheader from "@/components/gig/Gigheader";
import ColorLoading from "@/components/loaders/ColorLoading";
import AlreadyReviewModal from "@/components/modals/AlreadyReviewModall";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { fonts } from "@/utils";
import { searchfunc } from "@/utils/index";
import { useAuth } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MyGigs = () => {
  const { userId } = useAuth();
  const { loading, gigs } = useAllGigs();
  const { user } = useCurrentUser(userId || null);
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.city ? user?.city : "all"
  );
  let gigQuery;
  const router = useRouter();
  const [secret, setSecret] = useState<string>("");
  const { showModal, confirmEdit, setConfirmEdit, currentgig } = useStore();
  const [loadingSecret, setLoadingSecret] = useState<boolean>(false);
  const [forgotsecret, setForgotSecret] = useState<boolean>(false);
  console.log(currentgig?._id);
  const checkSecret = async () => {
    setLoadingSecret(true);
    try {
      const res = await fetch(
        `/api/gigs/check_secret?gigId=${currentgig?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secret }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get secret");
      }
      const data: {
        gigstatus: string;
        message: string;
        mygigId: string;
      } = await res.json();
      if (data.gigstatus === "true") {
        toast.success(data?.message);
        router.push(`/editpage/${data?.mygigId}`);
        setConfirmEdit(false);
      } else {
        toast.error(data?.message);
        setConfirmEdit(true);
      }
      setLoadingSecret(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get secret");
      setLoadingSecret(false);
      setConfirmEdit(true);
    }
  };

  return (
    <>
      {confirmEdit && (
        <article className="fixed z-50 inset-0 flex items-center justify-center  bg-opacity-80 backdrop-blur-[13px] w-[100%] mx-auto h-full -py-6">
          {!forgotsecret ? (
            <>
              {loadingSecret && (
                <div className="inset-0  absolute z-50 h-full w-[100%] flex justify-center items-center bg-opacity-70 backdrop-blur-[12px] ">
                  <CircularProgress
                    className="mx-auto mb-6 "
                    size={29}
                    thickness={4}
                    style={{
                      color: "yellow",
                    }}
                  />
                </div>
              )}
              <div className="flex h-full w-full ">
                <form
                  onSubmit={checkSecret}
                  className="flex h-full w-full justify-center items-center flex-col gap-4 bg-black/50"
                >
                  <div className="flexx flex-col">
                    <div className="w-[100%] mx-auto">
                      <p className="text-yellow-400 text-[12px] ">
                        NB:://Only the person who posted the gig can edit it.
                      </p>
                    </div>
                    <div className="w-[99%] mx-auto">
                      <p className="text-yellow-400 text-[12px] ">
                        Please enter the secret provided by the gig poster.
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={secret}
                    name="secret"
                    placeholder="Enter Gig Secret"
                    className="border-2 border-gray-300 rounded-md px-4 py-2 w-[70%] mx-auto font-mono"
                    onChange={(e) => setSecret(e.target.value)}
                  />
                  {!loadingSecret && (
                    <>
                      <button
                        type="submit"
                        style={{
                          width: "20%",
                          fontSize: ".8rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform: "translateY(-5px)",
                        }}
                        className=" px-3 py-2 text-white bg-cyan-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                      >
                        Verify
                      </button>
                      <p
                        className="text-cyan-400 underline underline-offset-2 "
                        style={{
                          fontFamily: fonts[2],
                        }}
                        onClick={() => setForgotSecret(true)}
                      >
                        Forgot Secret?
                      </p>
                    </>
                  )}
                </form>
              </div>
            </>
          ) : (
            <ForgotSecret {...currentgig} setForgotSecret={setForgotSecret} />
          )}
        </article>
      )}{" "}
      <div className="flex flex-col h-[calc(100vh-100px)] w-[90%] mx-auto my-2 shadow-md shadow-orange-300">
        {/* Fixed Header */}

        <div className="sticky top-0 z-10 bg-gray-900 shadow-md">
          <Gigheader
            typeOfGig={typeOfGig}
            setTypeOfGig={setTypeOfGig}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
          />
        </div>
        {/* Scrollable Gigs List */}
        <div className="h-[85%] overflow-y-scroll bg-gray-900">
          {gigs?.gigs?.length === 0 && (
            <h1 className="text-white text-center font-bold py-5">
              No gigs found
            </h1>
          )}
          {!loading ? (
            <div className="space-y-3 p-2 pb-[74px] pt-3">
              {" "}
              {/* Added pb-4 for bottom padding */}
              {searchfunc(gigs?.gigs, typeOfGig, category, gigQuery, location)
                ?.filter((gig: GigProps) => gig?.postedBy?._id === user?._id)
                ?.map((gig: GigProps) => (
                  <AllGigsComponent key={gig?._id} gig={gig} />
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <ColorLoading />
            </div>
            // <LoadingSpinner />
          )}{" "}
          {showModal && (
            <div className="fixed  w-[80%] mx-auto inset-0 bg-black/50 backdrop-blur-sm z-50 -mt-[150px] flex items-center justify-center">
              {/* Dim all other gigs */}
              {/* Center modal on parent gig */}
              <div className=" z-0 mt-10">
                {" "}
                <AlreadyReviewModal />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyGigs;
