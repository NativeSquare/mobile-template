import { ConvexError } from "convex/values";

export function getConvexErrorMessage(error: unknown) {
  return error instanceof ConvexError
    ? (error.data as { message: string }).message
    : "Unknown error occurred";
}
