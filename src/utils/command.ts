import { spawn } from "child_process";
import chalk from "chalk";
import type { CommandResult } from "../types/index.js";

/**
 * Run a command with real-time output
 * @param command - The command to run (e.g., 'npm', 'npx')
 * @param args - Array of command arguments
 * @param cwd - Working directory for the command
 * @returns Promise that resolves when command completes successfully
 */
export function runCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    console.log(chalk.dim(`Running: ${command} ${args.join(" ")}\n`));

    const child = spawn(command, args, {
      cwd: cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
