import Apple from "@auth/core/providers/apple";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { ResendOTP } from "./ResendOTP";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      verify: ResendOTP,
      reset: ResendOTPPasswordReset,
      crypto: {
        hashSecret: async (secret) => {
          return secret;
        },
        verifySecret: async (secret, hash) => {
          if (secret === hash) {
            return true;
          }
          throw new ConvexError({ message: "Email or password is incorrect" });
        },
      },
    }),
    GitHub,
    Google,
    Apple({
      profile: (appleInfo) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined;
        return {
          id: appleInfo.sub,
          name: name,
          email: appleInfo.email,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      console.log("redirectTo: ", redirectTo);
      if (redirectTo !== "findr://" && redirectTo !== "http://localhost:3000") {
        throw new Error(`Invalid redirectTo URI ${redirectTo}`);
      }
      return redirectTo;
    },
  },
});
