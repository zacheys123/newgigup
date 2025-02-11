import mongoose, { Schema, Document, Types } from "mongoose";

// Define types for the related models (User, Message, Gig)
// interface IUser extends Document {
//   username: string;
//   firstname: string;
//   lastname: string;
//   picture: string;
// }

// interface IMessage extends Document {
//   sender: Types.ObjectId | IUser;
//   receiver: Types.ObjectId | IUser;
//   content: string;
//   timestamp: Date;
// }

interface IGig extends Document {
  title: string;
  description: string;
  price: number;
  // Other fields specific to Gig
}

// Define Chat interface
interface IChat extends Document {
  users: Types.ObjectId[]; // References to User model
  messages: Types.ObjectId[]; // References to Message model
  gigChat: Types.ObjectId | IGig; // Reference to Gig model
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
    gigChat: { type: Schema.Types.ObjectId, ref: "Gig" },
  },
  { timestamps: true }
);

// Using the typesafe approach for model registration
const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
