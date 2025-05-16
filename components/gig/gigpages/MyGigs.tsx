"use client";
import useStore from "@/app/zustand/useStore";
import AllGigsComponent from "@/components/gig/AllGigsComponent";
import ForgotSecret from "@/components/gig/ForgotSecret";
import Gigheader from "@/components/gig/Gigheader";
import ColorLoading from "@/components/loaders/ColorLoading";
import AlreadyReviewModal from "@/components/modals/AlreadyReviewModall";
import { useAllGigs } from "@/hooks/useAllGigs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import { GigProps } from "@/types/giginterface";
import { filterGigs, fonts } from "@/utils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const MyGigs = () => {
  const { loading: gigsLoading, gigs, mutateGigs } = useAllGigs();
  const { user } = useCurrentUser();
  const [typeOfGig, setTypeOfGig] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>(() => "all");
  const [scheduler, setScheduler] = useState<string>("all");
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
  const debouncedSearch = useDebounce(typeOfGig, 300);
  //
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
        localStorage.setItem("secret", JSON.stringify(data?.secret));

        toast.success(data?.message);
        setTimeout(() => {
          router.push(`/editpage/${data?.gigId}`);
          setConfirmEdit(false);
        }, 0);
        setLoadingSecret(false);
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
      setLoadingSecret(false);
      // ... other cleanup
    }
  };

  const [sortOption, setSortOption] = useState<string>("relevance");
  const filteredGigs = useMemo(() => {
    const filtered = filterGigs(gigs, {
      searchQuery: debouncedSearch,
      category,
      location,
      scheduler,
    });

    // Additional filtering for user-specific conditions
    const result =
      filtered?.filter(
        (gig: GigProps) => gig?.postedBy?._id === user?.user?._id
      ) || [];

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "highest":
        result.sort((a, b) => {
          const priceA = parseFloat(a.price || "0") || 0;
          const priceB = parseFloat(b.price || "0") || 0;
          return priceB - priceA;
        });
        break;
      case "popular":
        result.sort(
          (a, b) => (b.viewCount?.length || 0) - (a.viewCount?.length || 0)
        );
        break;
      default:
        // Relevance sorting
        result.sort((a, b) => {
          const aViews = a.viewCount?.length || 0;
          const bViews = b.viewCount?.length || 0;
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();

          return bViews * 0.7 + bDate * 0.3 - (aViews * 0.7 + aDate * 0.3);
        });
        break;
    }

    return result;
  }, [
    gigs,
    debouncedSearch,
    category,
    location,
    scheduler,
    user?.user?._id,
    sortOption,
  ]);

  const existingSecret = localStorage.getItem("secret");
  const isLoading = gigsLoading;
  console.log(scheduler);
  return (
    <>
      {confirmEdit && !existingSecret && (
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
                    autoComplete="off"
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
      <div className="flex flex-col min-h-screen w-full bg-gray-900">
        {/* Sticky Glass Header */}
        <div className="sticky top-0 z-30 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 shadow-lg">
          <Gigheader
            typeOfGig={typeOfGig}
            setTypeOfGig={setTypeOfGig}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            myuser={user?.user}
            scheduler={scheduler}
            setScheduler={setScheduler}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-4 md:p-8">
          {/* Premium Empty State */}{" "}
          <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {filteredGigs.length === 0 && !isLoading && (
              <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-700">
                  <div className="inline-flex mb-6 p-3 bg-gray-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                      Premium Opportunities Await
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                    Discover high-value gigs from top professionals. Refine your
                    search or explore our curated selections.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setCategory("all");
                        setLocation("all");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/20 hover:brightness-110"
                    >
                      Show All Listings
                    </button>
                    <button className="px-6 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg transition-all hover:bg-gray-700/50 hover:border-amber-500/30">
                      View Featured
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-full w-full">
                <ColorLoading />
              </div>
            )}

            {/* Gigs Grid */}
            {filteredGigs.length > 0 && (
              <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 ">
                      <span className="text-2xl font-bold text-white">
                        {filteredGigs.length}
                      </span>
                      <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-orange-300 font-semibold">
                        {"Gigs Pending and Booked"}
                      </span>
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">Sort:</span>
                    <select
                      className="text-sm bg-gray-800 border-gray-700 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-white"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option className="bg-gray-800" value="relevance">
                        Relevance
                      </option>
                      <option className="bg-gray-800" value="newest">
                        Newest First
                      </option>
                      <option className="bg-gray-800" value="highest">
                        Highest Budget
                      </option>
                      <option className="bg-gray-800" value="popular">
                        Most Viewed
                      </option>
                    </select>
                  </div>
                </div>
                <div className="max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-gray-800 pr-2 pb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 pb-10">
                    {filteredGigs.map((gig: GigProps) => (
                      <div
                        key={gig?._id}
                        className="border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-amber-500/30 hover:-translate-y-1"
                      >
                        <AllGigsComponent gig={gig} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Featured Section */}
            {(filteredGigs.length === 0 || filteredGigs.length < 4) &&
              !isLoading && (
                <div className="max-w-7xl mx-auto mt-12 border-t border-gray-800 pt-12">
                  <h3 className="text-xl font-semibold text-white mb-6 px-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Curated Selections
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:bg-gray-800 transition-colors"
                      >
                        <div className="h-40 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                          <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </main>

        {/* Floating CTA */}
        <div className="fixed bottom-6 right-6 z-20">
          <button className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-900 group-hover:rotate-90 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

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
