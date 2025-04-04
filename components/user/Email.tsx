"use client";
// components/EmailForm.tsx
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EmailFormProps {
  handleClose: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );
      console.log(result);
      toast.success("Email sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      handleClose(); // Close the form after submission
      router.push("/");
    } catch (error) {
      setResponseMessage("Failed to send email. Please try again later.");
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className=" relative max-w-md mx-auto p-6 bg-white shadow rounded">
      {" "}
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-center text-red-500">{responseMessage}</p>
      )}
    </div>
  );
};

export default EmailForm;
