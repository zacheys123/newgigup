import { ResponseProps } from "@/hooks/usePostComments";
import { useState, useEffect } from "react";



// interface UserProps {
//   picture?: string;
//   isMusician: boolean;
//   firstname?: string;
//   lastname:string
// }

interface FeedBackProps {
  post: ResponseProps;
}

function PostFeedBack({ post }: FeedBackProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format date to readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render star ratings
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < post.rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className={`w-[90%] max-w-2xl mx-auto my-6 transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
        {/* Header with user info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-purple-600">
                <img 
                  src={post?.postedBy?.picture || ''} 
                  alt={`${post?.postedBy?.firstname} ${post?.postedBy?.lastname}`   || 'User'} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                {post.postedBy?.isMusician ? "Musician" : "Client"}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
             {`${post?.postedBy?.firstname} ${post?.postedBy?.lastname}`   ||  'Anonymous User'}
              </h3>
              {post?.companyName && (
                <p className="text-sm text-purple-400 truncate">
                  {post?.companyName}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(post?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Rating stars */}
        <div className="px-6 pt-4 flex items-center">
          <div className="flex space-x-1">
            {renderStars()}
          </div>
          <span className="ml-2 text-sm font-medium text-yellow-500">
            {post?.rating?.toFixed(1)}
          </span>
        </div>
        
        {/* Testimonial content */}
        <div className="p-6">
          <div className="relative">
            <svg 
              className="absolute -left-4 -top-4 h-8 w-8 text-purple-700 opacity-30" 
              fill="currentColor" 
              viewBox="0 0 32 32"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            
            <p className="text-gray-300 text-lg italic relative z-10 pl-6">
              "{post?.description}"
            </p>
          </div>
        </div>
        
        {/* Decorative footer */}
        <div className="px-6 pb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-1 w-1 rounded-full bg-purple-600 opacity-50"
              ></div>
            ))}
          </div>
          
          <svg 
            className="h-5 w-5 text-purple-600 opacity-70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default PostFeedBack;