import { Resend as ResendAPI } from "resend";

const resend = new ResendAPI(process.env.AUTH_RESEND_KEY);

export async function sendEmail(
  params: Parameters<typeof resend.emails.send>[0]
) {
  const isDev = process.env.IS_DEV === "true";

  if (isDev) {
    console.log("[DEV EMAIL]", params);
    return;
  }

  const { error } = await resend.emails.send(params);

  if (error) {
    throw new Error("Could not send email: " + error.message);
  }
}
