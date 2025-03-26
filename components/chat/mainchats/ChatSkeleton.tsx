// components/ChatSkeleton.tsx
export const ChatSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded bg-gray-300 w-3/4"></div>
          <div className="h-3 rounded bg-gray-300 w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);
