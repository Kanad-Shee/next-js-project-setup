import chalk from "chalk";
import { runCommand } from "../utils/command.js";

/**
 * Initialize shadcn/ui
 * @param projectPath - Path to the project
 */
export async function initializeShadcn(projectPath: string): Promise<void> {
  console.log(chalk.cyan("\n🎨 Initializing shadcn/ui...\n"));

  try {
    const args = ["shadcn@latest", "init", "-d", "-y"];

    await runCommand("npx", args, projectPath);

    console.log(chalk.green("\n✅ shadcn/ui initialized successfully!\n"));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      chalk.red(`\n❌ Failed to initialize shadcn/ui: ${errorMessage}\n`),
    );
    process.exit(1);
  }
}
