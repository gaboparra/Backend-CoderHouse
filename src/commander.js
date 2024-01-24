import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variables para debug", false)
  .option("--persistence <persistence>", "persistencia");
program.parse();

if (typeof program.opts().persistence === "undefined") {
  program.opts().persistence = "MONGO";
}

console.log("persistencia ", program.opts().persistence);
export const opts = program.opts();
