import { UserProps } from "./userinterfaces";

export interface ChatProps {
  chatId: string;
  receiver: string | undefined; // Renamed for clarity
  sender: string | undefined;
  messages: MessageProps[]; // Directly using an array instead of MessagesProps
}

export interface MessageProps {
  _id?: string;
  chatId?: string | null; // Reference to the chat
  sender: UserProps; // Changed senderId to full UserProps for flexibility
  content: string;
  createdAt: Date; //
  reactions: string;
  tempId?: string;
  receiver: string | null;
  read: boolean;
}

export interface Messages {
  messages: MessageProps[];
}
