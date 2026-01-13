import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { users } from "./tables/users";

export default defineSchema({
  ...authTables,
  users,
});
