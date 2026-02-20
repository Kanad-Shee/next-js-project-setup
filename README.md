# Next.js Project Setup CLI

An interactive CLI tool to quickly setup Next.js projects with shadcn/ui. Works cross-platform on Windows, macOS, and Linux.

## Features

- 🎨 Beautiful interactive CLI interface
- 📁 Setup in current or new directory
- ⚡ Automated Next.js project initialization
- 🎨 Optional shadcn/ui setup
- 🦋 Optional Prettier code formatter configuration
- 🔄 Cross-platform compatible (Windows, macOS, Linux)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

Run the CLI tool:

```bash
npm start
```

Or if installed globally:

```bash
project-setup
```

## How It Works

The CLI will guide you through the following steps:

### 1. Choose Setup Location

- **Current directory**: Setup Next.js in the current folder
- **New directory**: Create a new folder for your project

### 2. Project Name (if new directory)

- Enter a name for your project
- Only letters, numbers, hyphens, and underscores allowed

### 3. Initialize Next.js

- Confirm to start Next.js project initialization
- Automatically sets up with TypeScript, Tailwind CSS, ESLint, and App Router
- Choose "No" to exit

### 4. Initialize shadcn/ui

- Confirm to setup shadcn/ui components
- Uses default configuration for quick setup
- Choose "No" to skip shadcn setup

### 5. Setup Prettier (Optional)

- Confirm to setup Prettier code formatter
- Automatically installs Prettier with Tailwind CSS plugin
- Creates `.prettierrc` and `.prettierignore` files
- Adds format scripts to package.json
- Choose "No" to skip Prettier setup

## What Gets Installed

### Next.js Configuration:

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint
- ✅ App Router
- ✅ src/ directory structure
- ✅ Import alias (@/\*)

### shadcn/ui Configuration:

- ✅ Default theme
- ✅ Component library setup
- ✅ Ready to add components

### Prettier Configuration (Optional):

- ✅ Prettier with best practices
- ✅ Tailwind CSS plugin for class sorting
- ✅ ESLint integration (eslint-config-prettier)
- ✅ Pre-configured formatting rules
- ✅ Format scripts in package.json
- ✅ .prettierignore for excluded files

## After Setup

Once setup is complete, navigate to your project and start the development server:

```bash
cd your-project-name
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding shadcn Components

After shadcn is initialized, you can add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Using Prettier

If you enabled Prettier during setup, you can format your code using:

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

### Prettier Configuration

The CLI creates a `.prettierrc` file with these settings:

- **semi**: true - Use semicolons
- **singleQuote**: false - Use double quotes
- **tabWidth**: 2 - 2 spaces per indent
- **trailingComma**: "es5" - Trailing commas where valid in ES5
- **printWidth**: 80 - 80 characters per line
- **arrowParens**: "always" - Always include parens for arrow functions
- **plugins**: Includes Tailwind CSS class sorting

You can customize these settings by editing the `.prettierrc` file in your project root.

## Global Installation (Optional)

To use this tool globally from anywhere:

```bash
npm link
```

Then you can run it from any directory:

```bash
project-setup
```

## Troubleshooting

### Permission Denied (Unix/Linux/macOS)

If you get a permission error, make the script executable:

```bash
chmod +x index.js
```

### Command Not Found

Make sure Node.js is installed and in your PATH:

```bash
node --version
npm --version
```

### Network Issues

If installation fails due to network issues, try:

```bash
npm config set registry https://registry.npmjs.org/
```

## Dependencies

- **chalk**: Terminal styling
- **inquirer**: Interactive prompts
- **gradient-string**: Gradient text effects
- **chalk-animation**: Animated text
- **figlet**: ASCII art text
- **nanospinner**: Loading spinners

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
