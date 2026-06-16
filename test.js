var sass = require("sass");
var path = require("path");
var assert = require("node:assert");

var sassFile = path.join(__dirname, "test", "hsluv-tests.scss");

var passes = 0;
var failures = 0;
var currentDescribe = "";
var currentIt = "";

var result = sass.compile(sassFile, {
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
      var passed = args[2].assertBoolean().value;
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
