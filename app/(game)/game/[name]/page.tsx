"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { topics } from "@/data";
import { Question } from "@/types/gamesiinterface";
import { AnimatePresence, motion } from "framer-motion";

export default function QuizPage() {
  const { name } = useParams();
  const router = useRouter();
  const decodedTopic = decodeURIComponent(name as string);
  const topicData = topics.find((t) => t.name === decodedTopic);

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

  const { user } = useUser();

  const correctSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
  const wrongSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/wrong.mp3") : null;

  const getRandomQuestion = (): Question | null => {
    if (!topicData || topicData.questions.length === 0) return null;
    const unanswered = topicData.questions.filter(
      (q) => !answeredQuestions.includes(q)
    );
    if (unanswered.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * unanswered.length);
    return unanswered[randomIndex];
  };

  useEffect(() => {
    if (!topicData) {
      router.push("/game");
      return;
    }
    const first = getRandomQuestion();
    if (first) {
      setCurrentQuestion(first);
      setAllAnswers([first.correctAnswer, ...first.otherGuesses]);
      setTimeLeft(first.timeLimit || 30);
    }
  }, [topicData, router]);

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
      correctSound?.play();
    } else {
      wrongSound?.play();
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
          setAllAnswers([next.correctAnswer, ...next.otherGuesses]);
          setTimeLeft(next.timeLimit || 30);
        }
      }, 500);
    }, 1500);
  };

  // 🧠 Post score to backend only if not already posted and is higher than previous
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

  const exitQuiz = () => router.push("/game");

  const handleBackdropClick = () => {
    if (!isTransitioning) {
      setShowExitConfirm(true);
    }
  };

  if (!topicData) return null;

  if (!currentQuestion) {
    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            Quiz Complete
          </h2>
          <p className="text-gray-600 mb-4">
            Score:{" "}
            <span className="text-indigo-600 font-semibold">{score}</span> /{" "}
            {answeredQuestions.length}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Play Again
            </button>
            <button
              onClick={exitQuiz}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Change Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-sans"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-lg p-5 w-full max-w-sm shadow-xl transition-all duration-500 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-md text-gray-800 mb-4">
          {currentQuestion.question}
        </div>

        <div className="space-y-3 mb-4">
          <AnimatePresence>
            {allAnswers.map((answer) => (
              <motion.button
                key={answer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleAnswer(answer)}
                disabled={isAnswered}
                className={`w-full text-left px-4 py-2 rounded-md border transition-all text-sm font-medium ${
                  isAnswered && answer === currentQuestion.correctAnswer
                    ? "bg-green-100 border-green-500 text-green-700"
                    : selectedAnswer === answer && isAnswered
                    ? "bg-red-100 border-red-500 text-red-700"
                    : selectedAnswer === answer
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {answer}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {isAnswered && (
          <div
            className={`text-sm text-center rounded-md py-2 mb-2 font-medium ${
              showCorrect
                ? "text-green-700 bg-green-50"
                : "text-red-700 bg-red-50"
            }`}
          >
            {showCorrect
              ? "Correct! 🎉"
              : `Wrong! Answer: ${currentQuestion.correctAnswer}`}
          </div>
        )}

        <div className="text-center text-xs text-gray-500 mt-1">
          {timeLeft}s
        </div>
        <div className="text-center text-xs text-gray-400 mt-1">
          Question {questionCount + 1} / {topicData.questions.length}
        </div>
      </motion.div>

      {showExitConfirm && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-700">
              Are you sure you want to exit the quiz?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={exitQuiz}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
          🎉 New High Score Saved!
        </div>
      )}
    </div>
  );
}
