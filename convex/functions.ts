import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const markOnboardingCompleted = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, { hasCompletedOnboarding: true });
  },
});

export const updateUserAfterOnboarding = mutation({
  args: {
    userId: v.id("users"),
    data: v.object({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      bio: v.optional(v.string()),
      age: v.optional(v.number()),
      height: v.optional(v.string()),
      bodyTypes: v.optional(v.array(v.string())),
      orientation: v.optional(v.string()),
      lookingFor: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, args.data);
  },
});
