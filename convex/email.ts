import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { sendEmailRaw } from "./emailUtils";

export const sendEmail = mutation({
  args: {
    from: v.string(),
    to: v.union(v.string(), v.array(v.string())),
    subject: v.string(),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await sendEmailRaw({
      from: args.from,
      to: args.to,
      subject: args.subject,
      text: args.text,
    });
  },
});
