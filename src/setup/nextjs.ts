import chalk from "chalk";
import path from "path";
import { runCommand } from "../utils/command.js";

/**
 * Initialize Next.js project in a new directory
 * @param projectName - Name of the project
 * @param basePath - Base path where to create the project
 */
export async function initializeNextjs(
  projectName: string,
  basePath: string = process.cwd(),
): Promise<void> {
  console.log(chalk.cyan("\n🚀 Initializing Next.js project...\n"));
  console.log(chalk.yellow("This may take a few minutes. Please wait...\n"));

  try {
    const args = [
      "create-next-app@latest",
      projectName,
      "--typescript",
      "--tailwind",
      "--app",
      "--src-dir",
      "--import-alias",
      "@/*",
      "--no-git",
      "--use-npm",
    ];

    await runCommand("npx", args, basePath);

    console.log(
      chalk.green("\n✅ Next.js project initialized successfully!\n"),
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      chalk.red(`\n❌ Failed to initialize Next.js: ${errorMessage}\n`),
    );
    process.exit(1);
  }
}

/**
 * Initialize Next.js project in current directory
 * @param projectPath - Path to the current directory
 */
export async function initializeNextjsCurrentDir(
  projectPath: string,
): Promise<void> {
  console.log(
    chalk.cyan("\n🚀 Initializing Next.js project in current directory...\n"),
  );
  console.log(chalk.yellow("This may take a few minutes. Please wait...\n"));

  try {
    const args = [
      "create-next-app@latest",
      ".",
      "--typescript",
      "--tailwind",
      "--eslint",
      "--app",
      "--src-dir",
      "--import-alias",
      "@/*",
      "--no-git",
      "--use-npm",
    ];

    await runCommand("npx", args, projectPath);

    console.log(
      chalk.green("\n✅ Next.js project initialized successfully!\n"),
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      chalk.red(`\n❌ Failed to initialize Next.js: ${errorMessage}\n`),
    );
    process.exit(1);
  }
}
