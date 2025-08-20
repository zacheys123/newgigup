"use client"
import { useEffect, useState } from "react";
import SidebarNav from "@/components/gig/SideBarNav";
import PagesNav from "@/components/pages/PagesNav";
import { toast, Toaster } from "sonner";
import { usePostComments } from "@/hooks/usePostComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { saveFeedback } from "@/app/actions/saveFeedBack";

type GigLayoutProps = {
  children: React.ReactNode;
  editpage: React.ReactNode;
};

export default function GigLayout({ children, editpage }: GigLayoutProps) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { commentsCount, isLoading ,Allposts} = usePostComments();
  const { user } = useCurrentUser();
console.log("userPostsCount",commentsCount)
  // Effect to show modal based on comments count and timer
  useEffect(() => {
    if (isLoading) return;

    // For testing, show every minute, otherwise check comments count
    const shouldShowModal = commentsCount < 2;

    if (shouldShowModal) {
      // Set up interval for testing (appears every minute)
      const intervalId = setInterval(() => {
        setShowModal(true);
      }, 3600000); // 1 hour

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [commentsCount, isLoading]);

  const handleSubmit = async () => {
    try {
      await saveFeedback(user?.user?._id, company, description, rating);
      toast.success("Successfully sent Feedback");
      setTimeout(() => { setShowModal(false) }, 3000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send feedback");
    }
    
    // Reset form
    setCompany("");
    setDescription("");
    setRating(0);
  };

  return (
    <div className="bg-black min-h-screen w-full flex">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          classNames: {
            toast: "!bg-gray-800 !border !border-gray-700 !text-white",
            title: "!font-medium",
            actionButton: "!bg-blue-600 !text-white",
          },
        }}
      />
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-[150px] lg:ml-[200px] w-full transition-all duration-300">
        {editpage}
        <main className="h-[100%] overflow-auto w-full relative ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {children}
          </div>
        </main>
        <PagesNav />
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl p-6 max-w-md w-full border border-indigo-500 shadow-2xl transform-gpu transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90 slide-in-from-bottom-10">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Share Your Experience</h2>
              <p className="text-indigo-200">How has our app improved your musical journey?</p>
            </div>

            <div className="space-y-4">
              {/* Show company input only for clients */}
              {user?.user?.isClient && (
                <div className="animate-in fade-in-50">
                  <label htmlFor="company" className="block text-white mb-2">
                    Name of Company or Establishment:
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-indigo-900 text-white rounded-lg p-3 border border-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="Company, Band, Restaurant, Hotel, etc."
                  />
                </div>
              )}

              {/* Rating input - shown for both but required for musicians to start */}
              <div className="animate-in fade-in-50">
                <p className="text-white mb-2">How would you rate your experience?</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl transition-transform duration-150 hover:scale-125"
                    >
                      {star <= (hoverRating || rating) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-400">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description input - shown after rating is selected */}
              {rating > 0 && (
                <div className="animate-in fade-in-50">
                  <label htmlFor="description" className="block text-white mb-2">
                    Tell us how the app has improved your experience as a {user?.user?.isMusician ? "Musician" : "Client"}:
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-indigo-900 text-white rounded-lg p-3 border border-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    placeholder="This app has helped me by..."
                  />
                </div>
              )}

              {/* Submit button */}
              {/* For musicians: rating and description required */}
              {/* For clients: rating, description, and company required */}
              {rating > 0 && description.length > 0 && (
                user?.user?.isMusician || (user?.user?.isClient && company.length > 0)
              ) && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  Share Feedback
                </button>
              )}
            </div>

            {/* Animated decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      )}
    </div>
  );
}