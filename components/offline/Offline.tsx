import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <WifiOff className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {`You're Offline`}
        </h1>
        <p className="text-gray-600 mb-6">
          {`It seems you've lost your internet connection. Please check your
          network settings and try again.`}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full text-center text-blue-500 hover:text-blue-600 font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
