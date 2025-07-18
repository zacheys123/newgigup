// models/Topic.ts
import { Schema, models, model } from "mongoose";

const questionSchema = new Schema({
  question: String,
  choices: [String],
  correctAnswer: String,
  timeLimit: Number,
});

const topicSchema = new Schema({
  name: String,
  questions: [questionSchema],
});

export const Topic = models.Topic || model("Topic", topicSchema);
