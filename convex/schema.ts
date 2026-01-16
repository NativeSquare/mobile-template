import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { feedback } from "./table/feedback";
import { users } from "./table/users";

export default defineSchema({
  ...authTables,
  feedback,
  users,
});
