import chalk from "chalk";
import path from "path";
import { writeFile, readFile, fileExists } from "../utils/file.js";

const DOCKERFILE_CONTENT = `# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \\
  if [ -f yarn.lock ]; then yarn run build; \\
  elif [ -f package-lock.json ]; then npm run build; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
`;

const DOCKERIGNORE_CONTENT = `Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git
`;

/**
 * Initialize Docker configuration
 * @param projectPath - Path to the project
 */
export async function initializeDocker(projectPath: string): Promise<void> {
  console.log(chalk.cyan("\n📦 Setting Up Docker Configuration ...\n"));

  try {
    // Write Dockerfile
    const dockerFilePath = path.join(projectPath, "Dockerfile");
    writeFile(dockerFilePath, DOCKERFILE_CONTENT);

    // Write .dockerignore
    const dockerIgnoreFilePath = path.join(projectPath, ".dockerignore");
    writeFile(dockerIgnoreFilePath, DOCKERIGNORE_CONTENT);

    // Update next.config to enable standalone output for Docker
    const nextConfigPath = path.join(projectPath, "next.config.ts");
    if (fileExists(nextConfigPath)) {
      let nextConfig = readFile(nextConfigPath);

      // Add output: 'standalone' to the config
      if (!nextConfig.includes("output:")) {
        nextConfig = nextConfig.replace(
          "const nextConfig: NextConfig = {",
          "const nextConfig: NextConfig = {\n  output: 'standalone',",
        );
        writeFile(nextConfigPath, nextConfig);
      }
    }

    console.log(chalk.green("\n✅ Docker setup completed!"));
    console.log(chalk.dim("  Created: Dockerfile"));
    console.log(chalk.dim("  Created: .dockerignore"));
    console.log(chalk.dim("  Updated: next.config.ts (standalone output)\n"));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red(`\n❌ Failed to setup docker: ${errorMessage}\n`));
  }
}
