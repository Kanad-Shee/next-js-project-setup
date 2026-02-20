import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { pastel } from "gradient-string";

/**
 * Sleep utility
 * @param ms - Milliseconds to sleep (default: 2000)
 */
export const sleep = (ms: number = 2000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Display welcome screen with animation
 */
export async function welcome(): Promise<void> {
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
