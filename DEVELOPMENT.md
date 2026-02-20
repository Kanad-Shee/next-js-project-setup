# Development Guide

## Project Structure

```
src/
├── index.ts              # Entry point - CLI bootstrap
├── main.ts               # Main orchestration logic
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── command.ts       # Command execution utilities
│   ├── console.ts       # Console output and animations
│   └── file.ts          # File system operations
├── prompts/
│   └── index.ts         # User input prompts (inquirer)
└── setup/
    ├── nextjs.ts        # Next.js initialization
    ├── shadcn.ts        # shadcn/ui setup
    ├── prettier.ts      # Prettier configuration
    └── docker.ts        # Docker configuration
```

## Development Workflow

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run in Development

```bash
npm run dev
```

### Watch Mode (Auto-rebuild on changes)

```bash
npm run watch
```

### Test the CLI

```bash
npm start
# or
npm run dev
```

## Type Safety

All modules are fully typed with TypeScript:

- Strict mode enabled
- No implicit any
- Exact optional property types
- No unchecked indexed access

## Module Architecture

### Utils Layer

- **command.ts**: Executes shell commands with real-time output
- **console.ts**: Handles animations, welcome screen, and delays
- **file.ts**: File system operations (read, write, exists)

### Prompts Layer

- Centralized user interaction using inquirer
- Typed responses for all prompts
- Validation logic for user inputs

### Setup Layer

- Each feature (Next.js, shadcn, Prettier, Docker) in separate module
- Consistent error handling
- Clear success/failure messages

### Main Orchestrator

- Coordinates all setup steps
- Manages project path state
- Handles user's choice flow

## Publishing

Before publishing:

```bash
npm run prepublishOnly
```

This will automatically build the project. The `files` field in package.json ensures only necessary files are published.

## Adding New Features

1. Create new setup module in `src/setup/`
2. Add prompt function in `src/prompts/index.ts`
3. Wire it up in `src/main.ts`
4. Add types if needed in `src/types/index.ts`
5. Build and test

## Type Definitions

All custom types are in `src/types/index.ts`:

- `SetupLocation`: "Current" | "New"
- `CommandResult`: { success: boolean }
- `PrettierConfig`: Full Prettier configuration shape
- `ProjectConfig`: Project metadata
- `SetupOptions`: All user choices

## Error Handling

- All async functions have try-catch blocks
- Errors display user-friendly messages
- Process exits with code 1 on errors
- Spinners show error state before exit
