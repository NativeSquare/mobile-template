import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { pretty, render } from "@react-email/render";
import * as React from "react";
import { APP_DOMAIN, APP_NAME } from "../constants";
import ForgotPassword from "../src/emails/forgot-password";
import { sendEmail } from "../src/utils/sendEmail";

export const ResendOTPPasswordReset = Resend({
  id: "resend-otp-password-reset",
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
    const element = React.createElement(ForgotPassword, { code: token });
    const html = await pretty(await render(element));
    await sendEmail({
      from: `${APP_NAME} <no-reply@${APP_DOMAIN}>`,
      to: [email],
      subject: `Reset your password`,
      html: html,
    });
  },
});
