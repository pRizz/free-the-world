import { runCommand } from "./lib/command";

if (process.env.SKIP_CONTENT_COMPILE !== "true") {
  runCommand("bun", ["run", "scripts/compile-content.ts"]);
}

runCommand("bun", ["x", "vinxi", "build"]);
runCommand("bun", ["run", "scripts/finalize-static-output.ts"]);
