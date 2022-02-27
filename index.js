const yargs = require("yargs");
const sign = require("./sign");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 <command> [options]")
  .command(
    "punch [action]",
    "punch in or punch out",
    () => {},
    (argv) => {
      switch (argv.action) {
        case "in":
          sign("Punch in");
          break;
        case "out":
          sign("Punch out");
          break;
        default:
          console.log("Command cannot be recognized");
      }
    }
  )
  .command("config", "config the wallet").argv;
