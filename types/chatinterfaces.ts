import { UserProps } from "./userinterfaces";

export interface ChatProps {
  _id?: string;
  chatId: string;
  receiver: string | undefined;
  sender: string | undefined;
  users?: UserProps[]; // Make it optional
  messages: MessageProps[];
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
