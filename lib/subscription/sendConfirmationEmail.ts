// /lib/subscription/sendConfirmationEmail.ts
import emailjs from "@emailjs/nodejs";

export async function sendConfirmationEmail(
  email: string,
  username: string | undefined,
  nextBillingDate: Date
) {
  const emailParams = {
    to_email: email,
    to_name: username || "Customer",
    from_name: "GiguP",
    message: `Your Pro subscription is active! Next billing date: ${nextBillingDate.toDateString()}`,
  };

  await emailjs.send("service_nwyhhd2", "template_cixihko", emailParams, {
    publicKey: "difPipOJ5wlM6J2E6",
    privateKey: process.env.EMAILJS_PRIVATE_KEY!,
  });
}
