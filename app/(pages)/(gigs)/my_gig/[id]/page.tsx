"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import ForgotSecret from "@/components/gig/ForgotSecret";
import Gigheader from "@/components/gig/Gigheader";
import ColorLoading from "@/components/loaders/ColorLoading";
import AlreadyReviewModal from "@/components/modals/AlreadyReviewModall";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GigProps } from "@/types/giginterface";
import { fonts } from "@/utils";
import { searchfunc } from "@/utils/index";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MyGigs = () => {
  const { loading: gigsLoading, gigs, mutateGigs } = useAllGigs();
  const { user, loading: userLoading, mutateUser } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() =>
    user?.city ? user?.city : "all"
  );
  let gigQuery;
  const router = useRouter();
  const [secret, setSecret] = useState<string>("");
  const {
    showModal,
    confirmEdit,
    setConfirmEdit,
    currentgig,
    setLoadingPostId,
  } = useStore();
  const [loadingSecret, setLoadingSecret] = useState<boolean>(false);
  const [forgotsecret, setForgotSecret] = useState<boolean>(false);
  console.log(gigs);
  const checkSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      toast.error("Please enter a secret");
      return;
    }

    setLoadingSecret(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(
        `/api/gigs/check_secret?gigId=${currentgig?._id}`,
        {
          signal: controller.signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secret }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify secret");
      }

      if (data.gigstatus === "true") {
        toast.success(data?.message);
        setTimeout(() => {
          router.push(`/editpage/${data?.gigId}`);
          setConfirmEdit(false);
        }, 0);
      } else {
        setLoadingSecret(false);
        toast.error(data?.message);
      }
    } catch (error) {
      // if (error.includes ("AbortError")) {
      //   toast.error("Request timed out");
      // }
      console.log(error);
    } finally {
      clearTimeout(timeoutId);
      // ... other cleanup
    }
  };
  useEffect(() => {
    if (!user) {
      mutateUser().catch((error) => {
        console.error("Failed to mutate user:", error);
        // Consider adding toast notification here
      });
    }

    if (user?.city) {
      setLocation(user.city);
    }
  }, [user, mutateUser]);
  const filteredGigs = useMemo(() => {
    return (
      searchfunc(gigs, typeOfGig, category, gigQuery, location)?.filter(
        (gig: GigProps) => gig?.postedBy?._id === user?._id
      ) || []
    );
  }, [gigs, typeOfGig, category, location, gigQuery, user?._id]);

  const isLoading = gigsLoading || userLoading;
  console.log(user);
  return (
    <>
      {confirmEdit && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-[13px] w-[100%] mx-auto h-full -py-6">
          {!forgotsecret ? (
            <>
              {loadingSecret && (
                <div className="inset-0 absolute z-50 h-full w-[100%] flex justify-center items-center bg-opacity-70 backdrop-blur-[12px]">
                  <CircularProgress
                    className="mx-auto mb-6"
                    size={29}
                    thickness={4}
                    style={{ color: "yellow" }}
                  />
                </div>
              )}
              <div className="flex h-full w-full ">
                <form
                  onSubmit={checkSecret}
                  className=" flex h-full w-full justify-center items-center flex-col gap-4 bg-black/50"
                >
                  <div className="flex flex-col relative">
                    {" "}
                    <button
                      className="absolute right-1 -top-7 z-100 text-white "
                      onClick={() => {
                        setConfirmEdit(false);
                        setLoadingPostId("");
                      }}
                    >
                      x
                    </button>
                    <div className="w-[100%] mx-auto">
                      <p className="text-yellow-400 text-[12px]">
                        NB:://Only the person who posted the gig can edit it.
                      </p>
                    </div>
                    <div className="w-[99%] mx-auto">
                      <p className="text-yellow-400 text-[12px]">
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
                  <button
                    type="submit"
                    style={{
                      width: "20%",
                      fontSize: ".8rem",
                      fontWeight: "bold",
                      cursor: loadingSecret ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      transform: "translateY(-5px)",
                    }}
                    className="px-3 py-2 text-white bg-cyan-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                    disabled={loadingSecret}
                  >
                    {loadingSecret ? "Verifying..." : "Verify"}
                  </button>
                  <p
                    className="text-cyan-400 underline underline-offset-2"
                    style={{ fontFamily: fonts[2] }}
                    onClick={() => setForgotSecret(true)}
                  >
                    Forgot Secret?
                  </p>
                </form>
              </div>
            </>
          ) : (
            <ForgotSecret
              {...currentgig}
              setForgotSecret={setForgotSecret}
              mutateGigs={mutateGigs}
            />
          )}
        </div>
      )}
      <div className="flex flex-col h-[calc(100vh-100px)] w-[90%] mx-auto my-2 shadow-md shadow-orange-300">
        <div className="sticky top-0 z-10 bg-gray-900 shadow-md">
          <Gigheader
            typeOfGig={typeOfGig}
            setTypeOfGig={setTypeOfGig}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            myuser={user}
          />
        </div>
        <div className="h-[85%] overflow-y-scroll bg-gray-900">
          {filteredGigs.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-white text-xl font-bold mb-4">
                No gigs found
              </h1>
              <p className="text-gray-400 max-w-md text-center">
                Try adjusting your filters or check back later for new
                opportunities
              </p>
            </div>
          )}
          {!isLoading ? (
            <div className="space-y-3 p-2 pb-[74px] pt-3">
              {filteredGigs.map((gig: GigProps) => (
                <AllGigsComponent key={gig?._id} gig={gig} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <ColorLoading />
            </div>
          )}
          {showModal && (
            <div className="fixed w-[80%] mx-auto inset-0 bg-black/50 backdrop-blur-sm z-50 -mt-[150px] flex items-center justify-center">
              <div className="z-0 mt-10">
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
