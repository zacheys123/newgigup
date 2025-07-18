// models/Topic.ts
import { Schema, models, model } from "mongoose";

const questionSchema = new Schema({
  question: String,
  otherGuesses: [String],
  correctAnswer: String,
  timeLimit: Number,
});

const topicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" }, // Add this
  icon: { type: String, default: "" }, // Add this
  questions: [questionSchema],
});

export const Topic = models.Topic || model("Topic", topicSchema);
