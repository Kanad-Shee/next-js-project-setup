import chalk from "chalk";
import path from "path";
import { runCommand } from "../utils/command.js";
import { writeFile, readFile, fileExists } from "../utils/file.js";
import type { PrettierConfig } from "../types/index.js";

/**
 * Initialize Prettier configuration
 * @param projectPath - Path to the project
 * @param installPlugins - Whether to install Prettier plugins
 */
export async function initializePrettier(
  projectPath: string,
  installPlugins: boolean = false,
): Promise<void> {
  console.log(chalk.cyan("\n🦋 Setting up Prettier configuration...\n"));

  try {
    // Prettier configuration object
    const prettierConfig: PrettierConfig = {
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

    // Add plugins if requested
    if (installPlugins) {
      prettierConfig.plugins = [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
      ];
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
    writeFile(prettierPath, JSON.stringify(prettierConfig, null, 2));

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
    writeFile(prettierIgnorePath, prettierIgnore);

    // Install prettier and conditionally install plugins
    console.log(chalk.yellow("Installing Prettier...\n"));
    const args = ["install", "-D", "prettier", "eslint-config-prettier"];

    if (installPlugins) {
      args.push("prettier-plugin-tailwindcss");
      args.push("@trivago/prettier-plugin-sort-imports");
    }

    await runCommand("npm", args, projectPath);

    // Add format scripts to package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fileExists(packageJsonPath)) {
      const packageJson = JSON.parse(readFile(packageJsonPath));
      packageJson.scripts = {
        ...packageJson.scripts,
        format: "prettier --write .",
        "format:check": "prettier --check .",
      };
      writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      chalk.red(
        `\n❌ Failed to create prettier configuration: ${errorMessage}\n`,
      ),
    );
    process.exit(1);
  }
}
