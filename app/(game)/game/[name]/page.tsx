"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/types/gamesiinterface";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import GameLoadingPage from "../components/GameLoadingPage";
import { useTopic } from "@/hooks/useTopics";

const shuffleArray = (array: string[]): string[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
export default function QuizPage() {
  const { name } = useParams();
  const router = useRouter();
  const decodedTopic = decodeURIComponent(name as string);
  const { width, height } = useWindowSize();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [scorePosted, setScorePosted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { user } = useUser();

  const { topics } = useTopic();
  const [loadingState, setLoadingState] = useState<
    "loading" | "timeout" | "not-found" | "ready"
  >("loading");

  const topicData = topics.find((t) => t.name === decodedTopic);
  const getRandomQuestion = (): Question | null => {
    if (!topicData || topicData.questions.length === 0) return null;
    const unanswered = topicData.questions.filter(
      (q) => !answeredQuestions.includes(q)
    );
    if (unanswered.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * unanswered.length);
    return unanswered[randomIndex];
  };
  // useEffect(() => {
  //   if (topics.length > 0 && !topicData) {
  //     const timer = setTimeout(() => {
  //       router.push("/game");
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [topics, topicData, router]);

  useEffect(() => {
    if (loadingState === "ready" && topicData) {
      const firstQuestion = getRandomQuestion();
      console.log("firstQuestion,", firstQuestion);
      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        setAllAnswers(
          shuffleArray([
            firstQuestion.correctAnswer,
            ...firstQuestion.otherGuesses,
          ])
        );
        setTimeLeft(firstQuestion.timeLimit || 30);
      } else {
        // Handle case where topic exists but has no questions
        console.error("No questions found for this topic");
        setLoadingState("not-found");
        setTimeout(() => router.push("/game"), 2000);
      }
    }
  }, [loadingState, topicData]);
  useEffect(() => {
    if (!currentQuestion || isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, isAnswered]);

  const handleAnswer = (answer: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setShowCorrect(true);
    }

    setAnsweredQuestions((prev) => [...prev, currentQuestion]);
    setQuestionCount((prev) => prev + 1);

    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const next = getRandomQuestion();
        setCurrentQuestion(next);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowCorrect(false);
        setIsTransitioning(false);
        if (next) {
          setAllAnswers(
            shuffleArray([next.correctAnswer, ...next.otherGuesses])
          );
          setTimeLeft(next.timeLimit || 30);
        }
      }, 500);
    }, 1500);
  };

  useEffect(() => {
    const postScore = async () => {
      if (!currentQuestion && score > 0 && user && topicData && !scorePosted) {
        try {
          const res = await fetch(
            `/api/leaderboard?topic=${encodeURIComponent(
              topicData.name
            )}&userId=${user.id}`
          );
          const existing = await res.json();
          const bestPrevScore = existing?.[0]?.score || 0;

          if (score > bestPrevScore) {
            await fetch("/api/leaderboard", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                topic: topicData.name,
                score,
                username: user.username || user.fullName || "Anonymous",
              }),
            });
            setShowConfetti(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }

          setScorePosted(true);
        } catch (err) {
          console.error("Score posting failed", err);
        }
      }
    };
    postScore();
  }, [currentQuestion, score, topicData, user, scorePosted]);

  const resetQuiz = () => {
    setAnsweredQuestions([]);
    setQuestionCount(0);
    setScore(0);
    setScorePosted(false);
    const next = getRandomQuestion();
    setCurrentQuestion(next);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowCorrect(false);
    if (next) {
      setAllAnswers([next.correctAnswer, ...next.otherGuesses]);
      setTimeLeft(next.timeLimit || 30);
    }
  };

  const exitQuiz = () => router.push("/game/quiz");

  const handleBackdropClick = () => {
    if (!isTransitioning) setShowExitConfirm(true);
  };

  <GameLoadingPage loadingState={loadingState} />;

  if (!currentQuestion) {
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            recycle={false}
          />
        )}

        <div
          className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-sm text-center shadow-xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">
            Quiz Complete
          </h2>
          <p className="text-gray-300 mb-4 text-sm sm:text-base">
            Score:{" "}
            <span className="text-purple-400 font-semibold">{score}</span> /{" "}
            {answeredQuestions.length}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-sm sm:text-base"
            >
              Play Again
            </button>
            <button
              onClick={exitQuiz}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Change Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 font-sans"
      onClick={handleBackdropClick}
      initial={{
        backdropFilter: "blur(0px)",
        backgroundColor: "rgba(0,0,0,0)",
      }}
      animate={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
      exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.question}
          initial={{ x: "100%", opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: "-100%", opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full max-w-sm shadow-xl border border-gray-700`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-sm sm:text-base text-gray-100 mb-4">
            {currentQuestion.question}
          </div>

          <div className="space-y-2 sm:space-y-3 mb-4">
            <AnimatePresence mode="popLayout">
              {allAnswers.map((answer, i) => (
                <motion.button
                  key={answer}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  onClick={() => handleAnswer(answer)}
                  disabled={isAnswered}
                  className={`w-full text-left px-3 py-2 sm:px-4 sm:py-2 rounded-md border transition-all text-xs sm:text-sm font-medium ${
                    isAnswered && answer === currentQuestion.correctAnswer
                      ? "bg-green-900/50 border-green-500 text-green-300"
                      : selectedAnswer === answer && isAnswered
                      ? "bg-red-900/50 border-red-500 text-red-300"
                      : selectedAnswer === answer
                      ? "bg-blue-900/50 border-blue-400 text-blue-300"
                      : "border-gray-600 hover:bg-gray-700/50 text-gray-200"
                  }`}
                >
                  {answer}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          {isAnswered && (
            <div className="relative">
              <div
                className={`text-xs sm:text-sm text-center rounded-md py-2 mb-2 font-medium ${
                  showCorrect
                    ? "text-green-300 bg-green-900/30"
                    : "text-red-300 bg-red-900/30"
                }`}
              >
                {showCorrect
                  ? "Correct! 🎉"
                  : `Answer: ${currentQuestion.correctAnswer}`}
              </div>
              {showCorrect && <SparkleBurst />}
            </div>
          )}

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <div>{timeLeft}s remaining</div>
            <div>
              Q{questionCount + 1}/{topicData && topicData.questions.length}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {showExitConfirm && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowExitConfirm(false)}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-xl shadow-xl text-center max-w-sm w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-300 text-sm sm:text-base">
              Are you sure you want to exit the quiz?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={exitQuiz}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showToast && (
        <motion.div
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded shadow-lg text-sm sm:text-base"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          🎉 New High Score Saved!
        </motion.div>
      )}
    </motion.div>
  );
}

function SparkleBurst() {
  const sparkles = Array.from({ length: 12 }).map(() => ({
    id: uuidv4(),
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: sparkle.x,
            y: sparkle.y,
            scale: 1.5,
          }}
          transition={{
            duration: 0.8,
            delay: sparkle.delay,
            ease: "easeOut",
          }}
          className="w-2 h-2 rounded-full bg-yellow-300 shadow-md"
        />
      ))}
    </div>
  );
}
