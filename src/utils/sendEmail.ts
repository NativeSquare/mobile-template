import { Resend as ResendAPI } from "resend";

const resend = new ResendAPI(process.env.AUTH_RESEND_KEY);

export async function sendEmail(
  params: Parameters<typeof resend.emails.send>[0]
) {
  const isDev = process.env.IS_DEV === "true";

  if (isDev) {
    // Extract verification code from HTML if it's a verification email
    if (params.html && typeof params.html === "string") {
      const codeMatch = params.html.match(
        /<strong[^>]*data-testid="verification-code"[^>]*>([^<]+)<\/strong>/
      );
      if (codeMatch) {
        console.log("Code found: ", codeMatch[1]);
      }
    }

    return;
  }

  const { error } = await resend.emails.send(params);

  if (error) {
    throw new Error("Could not send email: " + error.message);
  }
}
