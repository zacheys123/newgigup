import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  chatId: mongoose.Types.ObjectId; // Reference to the chat
  reactions: string; // This field can be extended to hold reactions like "like", "dislike", "comment", etc.
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    reactions: { type: String, required: true },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
