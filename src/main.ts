import chalk from "chalk";
import path from "path";
import { welcome } from "./utils/console.js";
import { createProjectDirectory } from "./utils/file.js";
import {
  askSetupLocation,
  askProjectName,
  askInitializeNextjs,
  askInitializeShadcn,
  askInitializePrettier,
  askInstallPrettierPlugins,
  askInitializeDocker,
} from "./prompts/index.js";
import {
  initializeNextjs,
  initializeNextjsCurrentDir,
} from "./setup/nextjs.js";
import { initializeShadcn } from "./setup/shadcn.js";
import { initializePrettier } from "./setup/prettier.js";
import { initializeDocker } from "./setup/docker.js";

/**
 * Main CLI orchestrator function
 */
export async function main(): Promise<void> {
  await welcome();

  let projectPath = process.cwd();
  let projectName: string | undefined;

  // Step 1: Ask where to setup
  const setupLocation = await askSetupLocation();

  // Step 2 & 3: If new directory, ask for name and create folder
  if (setupLocation.toLowerCase() === "new") {
    projectName = await askProjectName();
    projectPath = await createProjectDirectory(projectName);
  } else {
    console.log(chalk.yellow("\n📁 Using current directory"));
  }

  // Step 4: Ask to initialize Next.js
  const shouldInitNextjs = await askInitializeNextjs();

  if (!shouldInitNextjs) {
    console.log(chalk.yellow("\n👋 Setup cancelled. Goodbye!"));
    process.exit(0);
  }

  // Initialize Next.js
  if (setupLocation.toLowerCase() === "new") {
    await initializeNextjs(projectName!, process.cwd());
    // Update project path after Next.js creates the directory
    projectPath = path.join(process.cwd(), projectName!);
  } else {
    await initializeNextjsCurrentDir(projectPath);
  }

  // Step 5: Ask to initialize shadcn
  const shouldInitShadcn = await askInitializeShadcn();

  if (!shouldInitShadcn) {
    console.log(chalk.green("\n✨ Setup completed!"));
    console.log(chalk.cyan(`\n📂 Project location: ${projectPath}`));
    console.log(chalk.cyan("\n🎉 Your Next.js project is ready to go!"));
    process.exit(0);
  }

  // Initialize shadcn
  await initializeShadcn(projectPath);

  // Step 6: Ask to initialize prettier
  const shouldInitPrettier = await askInitializePrettier();
  let shouldInstallPlugins = false;

  if (shouldInitPrettier) {
    shouldInstallPlugins = await askInstallPrettierPlugins();
    await initializePrettier(projectPath, shouldInstallPlugins);
  }

  // Step 7: Ask to setup docker
  const shouldInitDocker = await askInitializeDocker();
  if (shouldInitDocker) {
    await initializeDocker(projectPath);
  }

  // Final success message
  console.log(chalk.green.bold("\n✨ Setup completed successfully! ✨"));
  console.log(chalk.cyan(`\n📂 Project location: ${projectPath}`));
  console.log(
    chalk.cyan(
      `\n🎉 Your Next.js project with shadcn/ui${shouldInitPrettier ? " and Prettier" : ""} is ready!`,
    ),
  );
  console.log(chalk.yellow("\n📝 Next steps:"));
  if (setupLocation.toLowerCase() === "new" && projectName) {
    console.log(chalk.white(`  1. cd ${projectName}`));
  }
  console.log(chalk.white(`  2. npm run dev`));
  console.log(chalk.white(`  3. Open http://localhost:3000\n`));
  if (shouldInitPrettier) {
    console.log(chalk.dim("\n💡 Format your code with: npm run format"));
  }
}
