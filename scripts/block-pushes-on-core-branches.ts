import { execSync } from "child_process";

const protectedBranches = ["main", "preview", "qa", "dev"];

const getCurrentBranch = () =>
  execSync("git symbolic-ref --short HEAD", { encoding: "utf8" }).trim();

const currentBranch = getCurrentBranch();

if (protectedBranches.includes(currentBranch)) {
  console.error(`🚫 Branch "${currentBranch}" is protected.`);

  if (currentBranch === "main") {
    console.error('🔒 No direct commits or pushes to "main".');
    console.error('➡ Use PR from "preview" → "main".');
  }

  if (currentBranch === "preview") {
    console.error('🔒 No direct commits or pushes to "preview".');
    console.error('➡ Use PR from "qa" → "preview".');
  }

  if (currentBranch === "qa") {
    console.error('🔒 No direct commits or pushes to "qa".');
    console.error('➡ Use PR from "dev" → "qa".');
  }

  if (currentBranch === "dev") {
    console.error('🔒 No direct commits or pushes to "dev".');
    console.error("➡ Create a feature/sub branch:");
    console.error("   git checkout -b feature/xyz");
  }

  process.exit(1);
}
