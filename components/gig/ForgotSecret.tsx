import useStore from "@/app/zustand/useStore";
import { UserProps } from "@/types/userinterfaces";
import { CircularProgress } from "@mui/material";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";

const ForgotSecret = ({
  _id,
  secret,
  postedBy,
  setForgotSecret,
}: {
  _id?: string | undefined;
  secret: string;
  postedBy: UserProps;
  setForgotSecret: (forgetsecret: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [confirmSecret, setConfirmSecret] = useState("");
  const [success, setSuccess] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [secretErrors, setSecretErrors] = useState<string[]>([]);
  const { setConfirmEdit } = useStore();
  const [loadingsecret, setLoadingSecret] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => setError(""), 5000);
    const timeout2 = setTimeout(() => setSuccess(""), 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [error, success]);

  const checkEmail = (input: string) => {
    setEmail(input);

    if (!input.trim()) {
      setError("");
      setSuccess("");
      setIsValidEmail(false);
      return;
    }

    if (input.trim() === postedBy?.email) {
      setError("");
      setSuccess("✅ Valid Email detected");
      setIsValidEmail(true);
    } else {
      setError("❌ Invalid email address");
      setSuccess("");
      setIsValidEmail(false);
    }
  };

  const validateSecrets = (secret: string, confirmSecret: string) => {
    const errors = [];

    if (secret.length < 8) {
      errors.push("Secret should be at least 8 characters long.");
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        secret
      )
    ) {
      errors.push(
        "Secret must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    if (secret !== confirmSecret) {
      errors.push("Both Secrets Must match.");
    }

    setSecretErrors(errors);
  };

  useEffect(() => {
    validateSecrets(newSecret, confirmSecret);
  }, [newSecret, confirmSecret]);

  return (
    <section className="h-full w-full flex justify-center items-center">
      <div
        className={
          email === postedBy?.email
            ? "flex flex-col gap-5 w-[80%] mx-auto max-w-md bg-white  shadow-lg py-[70px] -mt-10 p-6 rounded-xl"
            : "flex flex-col gap-5 w-[85%] mx-auto max-w-md  shadow-lg p-6 rounded-xl -mt-7"
        }
      >
        {/* Email Input */}{" "}
        {email === postedBy?.email && (
          <h4 className="text-center font-bold  font-sans">
            Personal Gig Secret Recovery
          </h4>
        )}
        <div className="flex flex-col items-center relative">
          <input
            type="email"
            autoComplete="off"
            value={email}
            name="email"
            placeholder="Enter Email Address..."
            className={`text-sm rounded-md px-4 py-2 w-full border-2 outline-none transition ${
              isValidEmail
                ? "border-green-400 shadow-md shadow-green-300 pointer-events-none cursor-none bg-gray-200"
                : "border-gray-300"
            }`}
            onChange={(e) => checkEmail(e.target.value)}
            disabled={email === postedBy?.email}
          />
          {isValidEmail && (
            <TiTick className="absolute right-3 top-3 text-green-500 text-xl" />
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </div>
        {/* Secret Update Section */}
        {isValidEmail && (
          <div className="flex flex-col gap-3 relative">
            {/* Display Old Secret */}
            <input
              type="text"
              value={secret}
              name="secret"
              placeholder="Gig Secret"
              className="border-2 border-gray-300 rounded-md px-4 py-2 w-full bg-gray-100"
              disabled
            />

            {/* New Secret Input */}
            <div className="flex items-center border-2 border-gray-300 rounded-md px-4 py-2 w-full bg-gray-100">
              <input
                type={showPassword ? "text" : "password"}
                value={newSecret}
                name="newSecret"
                placeholder="Enter New Secret"
                className="flex-1 outline-none bg-transparent text-sm"
                onChange={(e) => setNewSecret(e.target.value)}
              />
              {showPassword ? (
                <EyeOffIcon
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeIcon
                  size={20}
                  className="cursor-pointer text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>

            {/* Confirm Secret Input */}
            <input
              type={showPassword ? "text" : "password"}
              value={confirmSecret}
              name="confirmSecret"
              placeholder="Confirm New Secret"
              className="border-2 border-gray-300 rounded-md px-4 py-2 w-full"
              onChange={(e) => setConfirmSecret(e.target.value)}
            />

            {/* Secret Errors */}
            {secretErrors.length > 0 && (
              <div className="text-red-500 text-sm space-y-1">
                {secretErrors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            {/* Update Button */}
            <button
              type="button"
              className={`w-full py-2 rounded-md text-white font-bold transition ${
                secretErrors.length === 0 && newSecret && confirmSecret
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={secretErrors.length > 0 || !newSecret || !confirmSecret}
              onClick={async () => {
                // TODO: Update secret logic
                setLoadingSecret(true);
                try {
                  const data = await fetch(
                    `/api/gigs/secret_update?gigId=${_id}`,

                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ newSecret }),
                    }
                  );
                  const gigs = await data.json();
                  console.log(gigs);
                  setLoadingSecret(false);
                } catch (error) {
                  setLoadingSecret(false);
                  console.error("Error updating secret:", error);
                }
              }}
            >
              {!loadingsecret ? (
                "Update Secret"
              ) : (
                <CircularProgress
                  size={24}
                  thickness={4}
                  className=""
                  style={{
                    color: "white",
                  }}
                />
              )}
            </button>
            <button
              className="absolute -top-[150px] right-1 text-[23px] font-bold text-neutral-300"
              onClick={() => {
                setForgotSecret(false);
                setConfirmEdit(true);
              }}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ForgotSecret;
