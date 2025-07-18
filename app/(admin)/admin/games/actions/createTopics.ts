"use server";
import connectDb from "@/lib/connectDb";
import { Topic } from "@/models/topics";
import { revalidatePath } from "next/cache";

interface Question {
  question: string;
  correctAnswer: string;
  otherGuesses: string[];
  timeLimit: number;
}

interface TopicData {
  name: string;
  description?: string;
  icon?: string;
  questions: Question[];
}

export async function createTopic(data: TopicData) {
  try {
    await connectDb();

    // Validate required fields
    if (!data.name || !data.questions || data.questions.length === 0) {
      throw new Error("Name and at least one question are required");
    }

    // Validate each question
    for (const question of data.questions) {
      if (
        !question.question ||
        !question.correctAnswer ||
        question.otherGuesses.length < 3
      ) {
        throw new Error(
          "Each question must have a question text, correct answer, and 3 incorrect options"
        );
      }
    }

    // Create the topic
    const newTopic = await Topic.create({
      name: data.name,
      description: data.description || "",
      icon: data.icon || "",
      questions: data.questions.map((q) => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        otherGuesses: q.otherGuesses,
        timeLimit: q.timeLimit || 30,
      })),
    });

    revalidatePath("/admin/games");
    return newTopic;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
}
