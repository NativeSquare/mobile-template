import { defineTable } from "convex/server";
import { v } from "convex/values";
import { generateFunctions } from "../utils/generateFunctions";

const documentSchema = {
  userId: v.id("users"),
  type: v.string(),
  feedbackText: v.string(),
  feedbackImages: v.optional(v.array(v.string())),
};

const partialSchema = {
  userId: v.optional(v.id("users")),
  type: v.optional(v.string()),
  feedbackText: v.optional(v.string()),
  feedbackImages: v.optional(v.array(v.string())),
};

export const feedback = defineTable(documentSchema)
  .index("by_user", ["userId"])
  .index("by_type", ["type"]);

export const {
  get,
  insert,
  patch,
  replace,
  delete: del,
} = generateFunctions("feedback", documentSchema, partialSchema);
