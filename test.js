var path = require("path");
var sassTrue = require("sass-true");

var sassFile = path.join(__dirname, "test", "hsluv-tests.scss");
sassTrue.runSass(
  { file: sassFile },
  {
    describe(label, block) {
      console.group(label);
      block();
      console.groupEnd();
    },
    it(label, block) {
      console.group("it", label);
      block();
      console.groupEnd();
    },
  }
);
