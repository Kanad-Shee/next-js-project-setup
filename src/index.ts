#!/usr/bin/env node

import chalk from "chalk";
import { main } from "./main.js";

/**
 * Next.js Project Setup CLI
 * Interactive CLI tool to quickly setup Next.js projects with TypeScript,
 * Tailwind CSS, shadcn/ui, Prettier, and Docker
 */

main().catch((error) => {
  console.error(chalk.red("\n❌ An error occurred:"), error);
  process.exit(1);
});
