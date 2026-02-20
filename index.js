#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { pastel } from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { promisify } from "util";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectPath = process.cwd();

// Helper function to run commands with real-time output
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(chalk.dim(`Running: ${command} ${args.join(" ")}\n`));

    const child = spawn(command, args, {
      cwd: cwd,
      stdio: "inherit", // Show all output in real-time
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

// Sleep helper
const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

// Welcome screen
async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "Welcome to Next.js Project Setup CLI! \n",
  );

  await sleep(2000);
  rainbowTitle.stop();

  console.log(`
    ${pastel.multiline(
      figlet.textSync("Next.js Setup", {
        font: "Standard",
        horizontalLayout: "default",
      }),
    )}
  `);
}

// Ask where to setup
async function askSetupLocation() {
  const answers = await inquirer.prompt({
    name: "location",
    type: "list",
    message: "Where do you want to setup your project? (Current/New)\n",
    choices: ["Current", "New"],
  });

  return answers.location;
}

// Ask for project name
async function askProjectName() {
  const answers = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "Enter your project name:",
    default: "my-nextjs-app",
    validate: (input) => {
      // Validate project name (no spaces, special chars except hyphens and underscores)
      if (/^[a-zA-Z0-9-_]+$/.test(input)) {
        return true;
      }
      return "Project name can only contain letters, numbers, hyphens, and underscores";
    },
  });

  return answers.project_name;
}

// Create project directory
async function createProjectDirectory(projectName) {
  const spinner = createSpinner("Creating project directory...").start();

  try {
    const newPath = path.join(process.cwd(), projectName);

    // Check if directory already exists
    if (fs.existsSync(newPath)) {
      spinner.error({
        text: chalk.red(`Directory "${projectName}" already exists!`),
      });
      process.exit(1);
    }

    // Create directory
    fs.mkdirSync(newPath, { recursive: true });
    projectPath = newPath;

    await sleep(1000);
    spinner.success({ text: chalk.green(`Directory created: ${projectName}`) });
    return newPath;
  } catch (error) {
    spinner.error({
      text: chalk.red(`Failed to create directory: ${error.message}`),
    });
    process.exit(1);
  }
}

// Ask to initialize Next.js
async function askInitializeNextjs() {
  const answers = await inquirer.prompt({
    name: "initialize",
    type: "confirm",
    message: "Start initializing the Next.js project?",
    default: true,
  });

  return answers.initialize;
}

// Initialize Next.js project
async function initializeNextjs(projectName) {
  console.log(chalk.cyan("\n🚀 Initializing Next.js project...\n"));
  console.log(chalk.yellow("This may take a few minutes. Please wait...\n"));

  try {
    // Use npx create-next-app with all flags to avoid prompts
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

    await runCommand("npx", args, process.cwd());

    console.log(
      chalk.green("\n✅ Next.js project initialized successfully!\n"),
    );
    return true;
  } catch (error) {
    console.error(
      chalk.red(`\n❌ Failed to initialize Next.js: ${error.message}\n`),
    );
    process.exit(1);
  }
}

// Initialize Next.js in current directory
async function initializeNextjsCurrentDir() {
  console.log(
    chalk.cyan("\n🚀 Initializing Next.js project in current directory...\n"),
  );
  console.log(chalk.yellow("This may take a few minutes. Please wait...\n"));

  try {
    // Use create-next-app with "." to install in current directory
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
    return true;
  } catch (error) {
    console.error(
      chalk.red(`\n❌ Failed to initialize Next.js: ${error.message}\n`),
    );
    process.exit(1);
  }
}

// Ask to initialize shadcn
async function askInitializeShadcn() {
  const answers = await inquirer.prompt({
    name: "initialize",
    type: "confirm",
    message: "Initialize shadcn/ui?",
    default: true,
  });

  return answers.initialize;
}

// Initialize shadcn
async function initializeShadcn() {
  console.log(chalk.cyan("\n🎨 Initializing shadcn/ui...\n"));

  try {
    // Initialize shadcn with default settings (non-interactive)
    const args = ["shadcn@latest", "init", "-d", "-y"];

    await runCommand("npx", args, projectPath);

    console.log(chalk.green("\n✅ shadcn/ui initialized successfully!\n"));
    return true;
  } catch (error) {
    console.error(
      chalk.red(`\n❌ Failed to initialize shadcn/ui: ${error.message}\n`),
    );
    process.exit(1);
  }
}

// Ask to initialize prettier
async function askInitializePrettier() {
  const answers = await inquirer.prompt({
    name: "initialize",
    type: "confirm",
    message: "Setup Prettier for code formatting?",
    default: true,
  });

  return answers.initialize;
}

// Ask to install prettier plugins
async function askInstallPrettierPlugins() {
  const answers = await inquirer.prompt({
    name: "plugins",
    type: "confirm",
    message:
      "Install plugins for sorting imports and prettifying Tailwind classes?",
    default: true,
  });

  return answers.plugins;
}

// Initialize prettier config
async function initializePrettier(installPlugins = false) {
  console.log(chalk.cyan("\n🦋 Setting up Prettier configuration...\n"));

  try {
    // Prettier configuration object
    const prettierConfig = {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 80,
      arrowParens: "always",
      endOfLine: "lf",
      bracketSpacing: true,
      jsxSingleQuote: false,
      proseWrap: "preserve",
      quoteProps: "as-needed",
      useTabs: false,
    };

    // Add plugins only if user wants them
    if (installPlugins) {
      prettierConfig.plugins = [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
      ];
      // Configuration for sort-imports plugin
      prettierConfig.importOrder = [
        "^(react/(.*)$)|^(react$)",
        "^(next/(.*)$)|^(next$)",
        "<THIRD_PARTY_MODULES>",
        "^@/(.*)$",
        "^[./]",
      ];
      prettierConfig.importOrderSeparation = true;
      prettierConfig.importOrderSortSpecifiers = true;
    }

    // Create .prettierrc file
    const prettierPath = path.join(projectPath, ".prettierrc");
    fs.writeFileSync(prettierPath, JSON.stringify(prettierConfig, null, 2));

    // Create .prettierignore file
    const prettierIgnore = `# Dependencies
node_modules/
.next/
out/
build/
dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env*.local

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
.next/
.vercel/
.turbo/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
`;

    const prettierIgnorePath = path.join(projectPath, ".prettierignore");
    fs.writeFileSync(prettierIgnorePath, prettierIgnore);

    // Install prettier and conditionally install plugins
    console.log(chalk.yellow("Installing Prettier...\n"));
    const args = ["install", "-D", "prettier", "eslint-config-prettier"];

    // Add plugin packages if user wants them
    if (installPlugins) {
      args.push("prettier-plugin-tailwindcss");
      args.push("@trivago/prettier-plugin-sort-imports");
    }

    await runCommand("npm", args, projectPath);

    // Add format scripts to package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      packageJson.scripts = {
        ...packageJson.scripts,
        format: "prettier --write .",
        "format:check": "prettier --check .",
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    console.log(chalk.green("\n✅ Prettier configured successfully!\n"));
    console.log(chalk.dim("  Created: .prettierrc"));
    console.log(chalk.dim("  Created: .prettierignore"));
    if (installPlugins) {
      console.log(
        chalk.dim(
          "  Installed: prettier, tailwind plugin, sort-imports plugin\n",
        ),
      );
    } else {
      console.log(chalk.dim("  Installed: prettier\n"));
    }
    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `\n❌ Failed to create prettier configuration: ${error.message}\n`,
      ),
    );
    process.exit(1);
  }
}

// Main function
async function main() {
  await welcome();

  // Step 1: Ask where to setup
  const setupLocation = await askSetupLocation();

  let projectName;

  // Step 2 & 3: If new directory, ask for name and create folder
  if (setupLocation.toLowerCase() === "new") {
    projectName = await askProjectName();
    await createProjectDirectory(projectName);
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
  if (setupLocation === "New directory") {
    await initializeNextjs(projectName);
    // Update project path after Next.js creates the directory
    projectPath = path.join(process.cwd(), projectName);
  } else {
    await initializeNextjsCurrentDir();
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
  await initializeShadcn();

  // Step 6: Ask to initialize prettier
  const shouldInitPrettier = await askInitializePrettier();

  if (shouldInitPrettier) {
    const shouldInstallPlugins = await askInstallPrettierPlugins();
    await initializePrettier(shouldInstallPlugins);
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
  if (setupLocation === "New directory") {
    console.log(chalk.white(`  1. cd ${projectName}`));
  }
  console.log(chalk.white(`  2. npm run dev`));
  console.log(chalk.white(`  3. Open http://localhost:3000\n`));
  if (shouldInitPrettier) {
    console.log(chalk.dim("\n💡 Format your code with: npm run format"));
  }
}

// Run the CLI
main().catch((error) => {
  console.error(chalk.red("An error occurred:"), error);
  process.exit(1);
});
