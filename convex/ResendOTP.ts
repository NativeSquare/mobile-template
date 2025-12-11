import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { pretty, render } from "@react-email/render";
import * as React from "react";
import { APP_DOMAIN, APP_NAME } from "../constants";
import VerifyEmail from "../src/emails/verify-email";
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
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const element = React.createElement(VerifyEmail, { code: token });
    const html = await pretty(await render(element));
    await sendEmail({
      from: `${APP_NAME} <no-reply@${APP_DOMAIN}>`,
      to: [email],
      subject: `Verify your email`,
      html: html,
    });
  },
});
