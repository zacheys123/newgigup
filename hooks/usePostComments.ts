// hooks/usePostComments.ts
import { UserProps } from '@/types/userinterfaces';
import { useState, useEffect } from 'react';

export interface ResponseProps{_id:string;
    postedBy: UserProps;
    companyName: string;
    rating: number;
    description:string;
    createdAt:Date
}

export const usePostComments = () => {
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
 const [Allposts, setPosts] = useState<ResponseProps[]>();
  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        // Replace with your actual API endpoint to get comments count
        const response = await fetch('/api/user/posts');
        const {posts,userPostsCount} = await response.json();
        setPosts(posts);
        setCommentsCount(userPostsCount || 0)
      } catch (error) {
        console.error('Error fetching comments count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentsCount();
  }, []);

  return { commentsCount, isLoading ,Allposts};
};