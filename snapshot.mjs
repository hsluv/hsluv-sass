import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "test", "data", "snapshot-rev4.json"),
    "utf8"
  )
);

const hexes = Object.keys(colors);

const BATCH_SIZE = 200;
const debugOutput = {};

for (let batchStart = 0; batchStart < hexes.length; batchStart += BATCH_SIZE) {
  const batch = hexes.slice(batchStart, batchStart + BATCH_SIZE);

  const sassSrc = `
@use 'conversions' as conv;
@use 'conversions/lch' as lch;
@use 'conversions/luv' as luv;
@use 'conversions/xyz' as xyz;
@use 'conversions/rgb' as rgb;

${batch
  .map((hex) => {
    const [r, g, b] = colors[hex].rgb;
    const suffix = hex.slice(1);
    const rr = Math.round(r * 255);
    const rg = Math.round(g * 255);
    const rb = Math.round(b * 255);
    return `
      $hsluv${suffix}: conv.rgb-hsluv(('r': ${rr}, 'g': ${rg}, 'b': ${rb}));
      $hpluv${suffix}: conv.rgb-hpluv(('r': ${rr}, 'g': ${rg}, 'b': ${rb}));
      $lch${suffix}: lch.from-hsluv($hsluv${suffix});
      $lch-from-hpluv${suffix}: lch.from-hpluv($hpluv${suffix});
      $luv${suffix}: luv.from-lch($lch${suffix});
      $xyz${suffix}: xyz.from-luv($luv${suffix});
      $rgb${suffix}: rgb.from-xyz($xyz${suffix});
      $xyz-back${suffix}: rgb.to-xyz(('r': ${rr}, 'g': ${rg}, 'b': ${rb}));
      $luv-back${suffix}: xyz.to-luv($xyz-back${suffix});
      $lch-back${suffix}: luv.to-lch($luv-back${suffix});
      $hsluv-back${suffix}: lch.to-hsluv($lch-back${suffix});
      $hpluv-back${suffix}: lch.to-hpluv($lch-back${suffix});

      @if not _snapshot-output("hsluv${suffix}", $hsluv${suffix}) {}
      @if not _snapshot-output("hpluv${suffix}", $hpluv${suffix}) {}
      @if not _snapshot-output("lch${suffix}", $lch${suffix}) {}
      @if not _snapshot-output("lch-from-hpluv${suffix}", $lch-from-hpluv${suffix}) {}
      @if not _snapshot-output("luv${suffix}", $luv${suffix}) {}
      @if not _snapshot-output("xyz${suffix}", $xyz${suffix}) {}
      @if not _snapshot-output("rgb${suffix}", $rgb${suffix}) {}
      @if not _snapshot-output("xyz-back${suffix}", $xyz-back${suffix}) {}
      @if not _snapshot-output("luv-back${suffix}", $luv-back${suffix}) {}
      @if not _snapshot-output("lch-back${suffix}", $lch-back${suffix}) {}
      @if not _snapshot-output("hsluv-back${suffix}", $hsluv-back${suffix}) {}
      @if not _snapshot-output("hpluv-back${suffix}", $hpluv-back${suffix}) {}
    `;
  })
  .join("\n")}
`;

  const result = sass.compileString(sassSrc, {
    loadPaths: [path.join(__dirname, "src")],
    functions: {
      "_snapshot-output($key, $value)": (args) => {
        const key = args[0].assertString().text;
        debugOutput[key] = sassValueToScss(args[1]);
        return sass.sassNull;
      },
    },
  });

  const progress = Math.min(batchStart + BATCH_SIZE, hexes.length);
  console.error(`Processed ${progress}/${hexes.length} colors...`);
}

function sassValueToScss(value) {
  if (value instanceof sass.SassMap) {
    const entries = [];
    value.contents.forEach((v, k) => {
      const key = k instanceof sass.SassString ? k.text : k.toString();
      entries.push(`"${key}": ${sassValueToScss(v)}`);
    });
    return "(" + entries.join(", ") + ")";
  }
  if (value instanceof sass.SassNumber) {
    let str = String(value.value);
    if ([...value.numeratorUnits].includes("deg")) str += "deg";
    return str;
  }
  if (value instanceof sass.SassColor) {
    const r = Math.round(value.red * 255);
    const g = Math.round(value.green * 255);
    const b = Math.round(value.blue * 255);
    return `("r": ${r}, "g": ${g}, "b": ${b})`;
  }
  if (value instanceof sass.SassString) {
    return `"${value.text}"`;
  }
  return String(value);
}

const lines = ["$values: ("];

hexes.forEach((hex, i) => {
  const last = i === hexes.length - 1;
  const s = hex.slice(1);

  lines.push(`  "${hex}": (`);
  lines.push(`    "hsluv": ${debugOutput["hsluv" + s]},`);
  lines.push(`    "hpluv": ${debugOutput["hpluv" + s]},`);
  lines.push(`    "lch": ${debugOutput["lch" + s]},`);
  lines.push(`    "lch-from-hpluv": ${debugOutput["lch-from-hpluv" + s]},`);
  lines.push(`    "luv": ${debugOutput["luv" + s]},`);
  lines.push(`    "xyz": ${debugOutput["xyz" + s]},`);
  lines.push(`    "rgb": ${debugOutput["rgb" + s]},`);
  lines.push(`    "xyz-back": ${debugOutput["xyz-back" + s]},`);
  lines.push(`    "luv-back": ${debugOutput["luv-back" + s]},`);
  lines.push(`    "lch-back": ${debugOutput["lch-back" + s]},`);
  lines.push(`    "hsluv-back": ${debugOutput["hsluv-back" + s]},`);
  lines.push(`    "hpluv-back": ${debugOutput["hpluv-back" + s]}`);
  lines.push(`  )${last ? "" : ","}`);
});

lines.push(");\n");

const outputPath = path.join(__dirname, "test", "data", "_snapshot.scss");
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(
  `Snapshot written to ${outputPath} (${hexes.length} colors)`
);
