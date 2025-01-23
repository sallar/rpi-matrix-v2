/**
 * Copies this project to the Raspberry Pi via rsync.
 * Create a JSON file named "sync.config.json" that has these properties:
 *  - username
 *  - hostname
 *  - directory
 *  - quiet (optional)
 */
import { directory, hostname, quiet, username } from "./sync.config.json";

import chalk from "chalk";
import Rsync from "rsync";

// Build the command
const rsync = Rsync.build({
  shell: "ssh",
  flags: "ahP",
  recursive: true,
  source: ["./build/clock"],
  destination: `${username}@${hostname}:${directory}`,
});

console.log(chalk.magenta(`\n🚀\t$ ${rsync.command()}`));

// Execute the command
rsync
  .output(
    (data) =>
      quiet ||
      console.log(
        chalk.blue(`📤\t${data.toString().split("\n").slice(0, 1).join("")}`),
      ),
    (stderr) =>
      quiet ||
      console.error(
        chalk.red(`📤\t${stderr.toString().split("\n").slice(0, 1).join("")}`),
      ),
  )
  .execute((error, code) => {
    if (error) {
      console.error(chalk.red("👎\t", error));
    } else {
      console.log(chalk.green(`👍\tDone! [exit code ${code}]\n\n`));
    }
  });
