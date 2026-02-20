import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { sleep } from "./console.js";

/**
 * Create a project directory
 * @param projectName - Name of the project directory to create
 * @param basePath - Base path where to create the directory (default: current directory)
 * @returns The full path to the created directory
 */
export async function createProjectDirectory(
  projectName: string,
  basePath: string = process.cwd(),
): Promise<string> {
  const spinner = createSpinner("Creating project directory...").start();

  try {
    const newPath = path.join(basePath, projectName);

    if (fs.existsSync(newPath)) {
      spinner.error({
        text: chalk.red(`Directory "${projectName}" already exists!`),
      });
      process.exit(1);
    }

    fs.mkdirSync(newPath, { recursive: true });

    await sleep(1000);
    spinner.success({ text: chalk.green(`Directory created: ${projectName}`) });
    return newPath;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    spinner.error({
      text: chalk.red(`Failed to create directory: ${errorMessage}`),
    });
    process.exit(1);
  }
}

/**
 * Write content to a file
 * @param filePath - Full path to the file
 * @param content - Content to write
 */
export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Read file content
 * @param filePath - Full path to the file
 * @returns File content as string
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Check if file exists
 * @param filePath - Full path to the file
 * @returns true if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
