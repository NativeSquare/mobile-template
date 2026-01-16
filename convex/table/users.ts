import { getAuthUserId } from "@convex-dev/auth/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { generateFunctions } from "../utils/generateFunctions";

const documentSchema = {
  // DO NOT REMOVE THESE FIELDS : https://labs.convex.dev/auth/setup/schema#customizing-the-users-table
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),

  // other "users" fields...
  bio: v.optional(v.string()),
  birthDate: v.optional(v.string()),
  hasCompletedOnboarding: v.optional(v.boolean()),
};

const partialSchema = {
  // DO NOT REMOVE THESE FIELDS : https://labs.convex.dev/auth/setup/schema#customizing-the-users-table
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),

  // other "users" fields...
  bio: v.optional(v.string()),
  birthDate: v.optional(v.string()),
  hasCompletedOnboarding: v.optional(v.boolean()),
};

export const users = defineTable(documentSchema).index("email", ["email"]);

export const {
  get,
  insert,
  patch,
  replace,
  delete: del,
} = generateFunctions("users", documentSchema, partialSchema);

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

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Delete all auth sessions for this user
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete all auth accounts for this user
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // Delete the user document
    await ctx.db.delete(userId);

    return { success: true };
  },
});
