import mongoose, { Schema, Document, Types } from "mongoose";

interface IGig extends Document {
  title: string;
  description: string;
  price: number;
  // Other fields specific to Gig
}
interface IChat extends Document {
  users: Types.ObjectId[]; // References to User model
  messages: Types.ObjectId[]; // References to Message model
  gigChat: Types.ObjectId | IGig; // Reference to Gig model
  clearedBy: Types.ObjectId;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
    gigChat: { type: Schema.Types.ObjectId, ref: "Gig" },
    clearedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track users who cleared the chat},
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
