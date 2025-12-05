import { Resend as ResendAPI } from "resend";

const resend = new ResendAPI(process.env.AUTH_RESEND_KEY);

export async function sendEmailRaw({
  from,
  to,
  subject,
  text,
}: {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
}) {
  const isDev = process.env.IS_DEV === "true";

  if (isDev) {
    console.log("[DEV EMAIL]", { from, to, subject, text });
    return;
  }

  const { error } = await resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    text: `${text}`,
  });

  if (error) {
    throw new Error("Could not send email: " + error.message);
  }
}
