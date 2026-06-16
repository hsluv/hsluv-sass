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

function approxEqual(a, b, tolerance = 1e-9) {
  if (a instanceof sass.SassNumber) {
    return b instanceof sass.SassNumber && Math.abs(a.value - b.value) <= tolerance;
  }

  if (a instanceof sass.SassMap) {
    if (!(b instanceof sass.SassMap) || a.contents.size !== b.contents.size) {
      return false;
    }
    const mapA = mapToObject(a);
    const mapB = mapToObject(b);
    for (const key of Object.keys(mapA)) {
      if (!Object.prototype.hasOwnProperty.call(mapB, key)) {
        return false;
      }
      if (!approxEqual(mapA[key], mapB[key], tolerance)) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof sass.SassColor) {
    return (
      b instanceof sass.SassColor &&
      a.red === b.red &&
      a.green === b.green &&
      a.blue === b.blue &&
      a.alpha === b.alpha
    );
  }

  if (a instanceof sass.SassString) {
    return b instanceof sass.SassString && a.text === b.text;
  }

  return String(a) === String(b);
}

function mapToObject(map) {
  const obj = {};
  map.contents.forEach((value, key) => {
    const keyStr = key instanceof sass.SassString ? key.text : key.toString();
    obj[keyStr] = value;
  });
  return obj;
}

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
    "_test_assert_approx($a, $b)": function (args) {
      return approxEqual(args[0], args[1]) ? sass.sassTrue : sass.sassFalse;
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
