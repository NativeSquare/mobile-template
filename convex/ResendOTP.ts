import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { sendEmail } from "../src/utils/sendEmail";

export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    await sendEmail({
      from: "My App <onboarding@dev.nativesquare.fr>",
      to: [email],
      subject: `Sign in to My App`,
      text: "Your code is " + token,
    });
  },
});
