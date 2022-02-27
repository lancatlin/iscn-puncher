require("dotenv").config();
const yargs = require("yargs");
const { sign, PUNCH_IN, PUNCH_OUT } = require("./sign");

yargs(process.argv.slice(2))
  .usage("Usage: $0 <command> [options]")
  .command(
    "punch [action]",
    "punch in or punch out",
    () => {},
    (argv) => {
      switch (argv.action) {
        case "in":
          sign(PUNCH_IN);
          break;
        case "out":
          sign(PUNCH_OUT);
          break;
        default:
          console.log("Command cannot be recognized");
      }
    }
  )
  .command("config", "config the wallet").argv;
