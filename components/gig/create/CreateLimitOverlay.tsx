import { useRouter } from "next/navigation";

const CreateLimitOverlay = ({
  showCreateLimitOverlay,
}: {
  showCreateLimitOverlay: boolean;
}) => {
  const router = useRouter(); // Use Next.js router for navigation
  const handleUpgradeClick = () => {
    router.push("/dashboard/billing");
  };

  return (
    showCreateLimitOverlay && (
      <div className="fixed inset-0 flex items-center justify-center p-6 bg-gray-900 bg-opacity-30 z-50 backdrop-blur-md">
        <span
          className="absolute right-2 top-4 text-white text-2xl font-bold md:cursor-pointer"
          onClick={() => {
            window.location.reload();
          }}
        >
          &times;
        </span>
        <div className="bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg backdrop-blur-sm max-w-lg w-full transform transition-all duration-500 ease-out scale-95 hover:scale-100 animate-fadeIn">
          <p className="text-3xl font-semibold text-gray-300 text-center ">
            You cannot create more gigs on the Free Plan.
          </p>
          <p className="text-lg text-red-300 mt-6 opacity-80 text-center">
            Upgrade to Pro to unlock more gig creation opportunities.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpgradeClick}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full transition duration-300 ease-in-out hover:bg-blue-400 hover:scale-105"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateLimitOverlay;
