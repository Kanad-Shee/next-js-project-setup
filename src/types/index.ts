export type SetupLocation = "Current" | "New";

export interface CommandResult {
  success: boolean;
}

export interface PrettierConfig {
  semi: boolean;
  singleQuote: boolean;
  tabWidth: number;
  trailingComma: string;
  printWidth: number;
  arrowParens: string;
  endOfLine: string;
  bracketSpacing: boolean;
  jsxSingleQuote: boolean;
  proseWrap: string;
  quoteProps: string;
  useTabs: boolean;
  plugins?: string[];
  importOrder?: string[];
  importOrderSeparation?: boolean;
  importOrderSortSpecifiers?: boolean;
}

export interface ProjectConfig {
  path: string;
  name?: string;
}

export interface SetupOptions {
  location: SetupLocation;
  projectName?: string;
  initNextjs: boolean;
  initShadcn: boolean;
  initPrettier: boolean;
  prettierPlugins: boolean;
  initDocker: boolean;
}
