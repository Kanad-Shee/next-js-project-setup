import inquirer from "inquirer";
import type { SetupLocation } from "../types/index.js";

/**
 * Ask where to setup the project
 */
export async function askSetupLocation(): Promise<SetupLocation> {
  const answers = await inquirer.prompt<{ location: SetupLocation }>({
    name: "location",
    type: "list",
    message: "Where do you want to setup your project? (Current/New)\n",
    choices: ["Current", "New"],
  });

  return answers.location;
}

/**
 * Ask for project name
 */
export async function askProjectName(): Promise<string> {
  const answers = await inquirer.prompt<{ project_name: string }>({
    name: "project_name",
    type: "input",
    message: "Enter your project name:",
    default: "my-nextjs-app",
    validate: (input: string) => {
      if (/^[a-zA-Z0-9-_]+$/.test(input)) {
        return true;
      }
      return "Project name can only contain letters, numbers, hyphens, and underscores";
    },
  });

  return answers.project_name;
}

/**
 * Ask to initialize Next.js
 */
export async function askInitializeNextjs(): Promise<boolean> {
  const answers = await inquirer.prompt<{ initialize: boolean }>({
    name: "initialize",
    type: "confirm",
    message: "Start initializing the Next.js project?",
    default: true,
  });

  return answers.initialize;
}

/**
 * Ask to initialize shadcn/ui
 */
export async function askInitializeShadcn(): Promise<boolean> {
  const answers = await inquirer.prompt<{ initialize: boolean }>({
    name: "initialize",
    type: "confirm",
    message: "Initialize shadcn/ui?",
    default: true,
  });

  return answers.initialize;
}

/**
 * Ask to initialize Prettier
 */
export async function askInitializePrettier(): Promise<boolean> {
  const answers = await inquirer.prompt<{ initialize: boolean }>({
    name: "initialize",
    type: "confirm",
    message: "Setup Prettier for code formatting?",
    default: true,
  });

  return answers.initialize;
}

/**
 * Ask to install Prettier plugins
 */
export async function askInstallPrettierPlugins(): Promise<boolean> {
  const answers = await inquirer.prompt<{ plugins: boolean }>({
    name: "plugins",
    type: "confirm",
    message:
      "Install plugins for sorting imports and prettifying Tailwind classes?",
    default: true,
  });

  return answers.plugins;
}

/**
 * Ask to initialize Docker
 */
export async function askInitializeDocker(): Promise<boolean> {
  const answers = await inquirer.prompt<{ initialize: boolean }>({
    name: "initialize",
    type: "confirm",
    message: "Initialize docker for your project?",
    default: false,
  });

  return answers.initialize;
}
