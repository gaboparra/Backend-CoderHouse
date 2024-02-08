import { Command } from "commander";
import logger from "./utils/logger.js";

const program = new Command();

program
  .option("-d", "Variables para debug", false)
  .option("--persistence <persistence>", "persistencia");
program.parse();

if (typeof program.opts().persistence === "undefined") {
  program.opts().persistence = "MONGO";
}

logger.info("persistencia ", program.opts().persistence);
export const opts = program.opts();
