import * as sass from "sass";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sassFile = path.join(__dirname, "test", "hsluv-tests.scss");

let passes = 0;
let failures = 0;
let currentDescribe = "";
let currentIt = "";

const result = sass.compile(sassFile, {
  loadPaths: [path.join(__dirname, "test")],
  functions: {
    "_test_start_group($name)": function (args) {
      currentDescribe = args[0].assertString().text;
      console.log(currentDescribe);
      return sass.sassNull;
    },
    "_test_start_test($name)": function (args) {
      currentIt = args[0].assertString().text;
      return sass.sassNull;
    },
    "_test_assert_result($assert, $expected, $passed)": function (args) {
      const passed = args[2].assertBoolean().value;
      if (passed) {
        passes++;
        console.log("  \u2713 " + currentIt);
      } else {
        failures++;
        console.log("  \u2717 " + currentIt);
        console.log("    Expected: " + String(args[1]));
        console.log("    Got:      " + String(args[0]));
      }
      return sass.sassNull;
    },
  },
});

console.log("");
console.log(passes + " passed, " + failures + " failed");

if (failures > 0) {
  process.exit(1);
}
