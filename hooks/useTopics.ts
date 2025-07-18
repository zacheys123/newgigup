import { Topic } from "@/types/gamesiinterface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "./useCurrentUser";

interface ResponseProps {
  topics: Topic[];
  totalQuestions: number;
}
export const useTopic = (decodedTopic?: string) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [responseData, setResponseData] = useState<ResponseProps>({
    topics: [],
    totalQuestions: 0,
  });
  const [loadingState, setLoadingState] = useState<
    "loading" | "timeout" | "not-found" | "ready"
  >("loading");
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`/api/topics?nocache=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();

        setResponseData({
          topics: data.topics,
          totalQuestions: data.totalQuestions,
        });
        console.log("topic data here", data);
        // Check if our topic exists in the fetched data
        const topicExists = data.topics.some(
          (t: Topic) => t.name === decodedTopic
        );
        if (!topicExists && !user?.user?.isAdmin) {
          setLoadingState("not-found");
          setTimeout(() => router.push("/game/quiz"), 2000);
          return;
        }

        setLoadingState("ready");
      } catch (err) {
        console.error("Failed to load topics", err);
        setLoadingState("timeout");
      }
    };

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loadingState === "loading") {
        setLoadingState("timeout");
      }
    }, 8000); // 8 second timeout

    fetchTopics();

    return () => clearTimeout(loadingTimeout);
  }, [decodedTopic, router]);
  return {
    topics: responseData.topics,
    totalQuestions: responseData.totalQuestions,
  };
};
