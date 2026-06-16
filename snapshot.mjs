import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const samples = [
  "#1100ff",
  "#0066aa",
  "#cc33cc",
  "#0022dd",
  "#0066ee",
  "#bbbb11",
  "#5566dd",
  "#55eeaa",
  "#ee7700",
  "#33bbaa",
  "#44aa77",
  "#dd6699",
  "#99ee22",
  "#ff22aa",
  "#99aa11",
  "#dd1122",
];

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function sassInspect($map) {
  const entries = [];
  if ($map.contents) {
    $map.contents.forEach((v, k) => {
      const key = k instanceof sass.SassString ? k.text : k.toString();
      entries.push(`'${key}': ${v}`);
    });
  }
  return new sass.SassString("(" + entries.join(", ") + ")");
}

const debugOutput = {};

const result = sass.compileString(
  `
@use 'conversions' as conv;
@use 'conversions/lch' as lch;
@use 'conversions/luv' as luv;
@use 'conversions/xyz' as xyz;
@use 'conversions/rgb' as rgb;

@function map-inspect($map) {
  @return map-inspect-custom($map);
}

${samples
  .map((color) => {
    const rgb = hexToRgb(color);
    const hex = color.slice(1);
    return `
      @debug "${color}-hsluv " + map-inspect(conv.rgb-hsluv(('r': ${rgb.r}, 'g': ${rgb.g}, 'b': ${rgb.b})));
      @debug "${color}-hpluv " + map-inspect(conv.rgb-hpluv(('r': ${rgb.r}, 'g': ${rgb.g}, 'b': ${rgb.b})));

      $hsluv${hex}: conv.rgb-hsluv(('r': ${rgb.r}, 'g': ${rgb.g}, 'b': ${rgb.b}));
      $hpluv${hex}: conv.rgb-hpluv(('r': ${rgb.r}, 'g': ${rgb.g}, 'b': ${rgb.b}));
      
      $lch-from-hsluv${hex}: lch.from-hsluv($hsluv${hex});
      $lch-from-hpluv${hex}: lch.from-hpluv($hpluv${hex});
      $luv${hex}: luv.from-lch($lch-from-hsluv${hex});
      $xyz${hex}: xyz.from-luv($luv${hex});
      $rgb-from-xyz${hex}: rgb.from-xyz($xyz${hex});
      
      $xyz-back${hex}: rgb.to-xyz(('r': ${rgb.r}, 'g': ${rgb.g}, 'b': ${rgb.b}));
      $luv-back${hex}: xyz.to-luv($xyz-back${hex});
      $lch-back${hex}: luv.to-lch($luv-back${hex});
      $hsluv-back${hex}: lch.to-hsluv($lch-back${hex});
      $hpluv-back${hex}: lch.to-hpluv($lch-back${hex});

      @debug "${color}-lch " + map-inspect($lch-from-hsluv${hex});
      @debug "${color}-luv " + map-inspect($luv${hex});
      @debug "${color}-xyz " + map-inspect($xyz${hex});
      @debug "${color}-rgb " + map-inspect($rgb-from-xyz${hex});
      @debug "${color}-xyz-back " + map-inspect($xyz-back${hex});
      @debug "${color}-luv-back " + map-inspect($luv-back${hex});
      @debug "${color}-lch-back " + map-inspect($lch-back${hex});
      @debug "${color}-hsluv-back " + map-inspect($hsluv-back${hex});
      @debug "${color}-hpluv-back " + map-inspect($hpluv-back${hex});
      @debug "${color}-lch-from-hpluv " + map-inspect($lch-from-hpluv${hex});
    `;
  })
  .join("\n")}
`,
  {
    loadPaths: [path.join(__dirname, "src")],
    functions: {
      "map-inspect-custom($map)": (args) => sassInspect(args[0]),
    },
    logger: {
      debug: (msg) => {
        const spaceIdx = msg.indexOf(" ");
        const key = msg.slice(0, spaceIdx);
        const val = msg.slice(spaceIdx + 1).trim();
        debugOutput[key] = val;
      },
      warn: () => {},
    },
  }
);

const lines = ["$values: ("];

samples.forEach((color, i) => {
  const last = i === samples.length - 1;

  lines.push(`  '${color}': (`);
  lines.push(`    'hsluv': ${debugOutput[color + "-hsluv"]},`);
  lines.push(`    'hpluv': ${debugOutput[color + "-hpluv"]},`);
  lines.push(`    'lch': ${debugOutput[color + "-lch"]},`);
  lines.push(`    'luv': ${debugOutput[color + "-luv"]},`);
  lines.push(`    'xyz': ${debugOutput[color + "-xyz"]},`);
  lines.push(`    'rgb': ${debugOutput[color + "-rgb"]},`);
  lines.push(`    'xyz-back': ${debugOutput[color + "-xyz-back"]},`);
  lines.push(`    'luv-back': ${debugOutput[color + "-luv-back"]},`);
  lines.push(`    'lch-back': ${debugOutput[color + "-lch-back"]},`);
  lines.push(`    'hsluv-back': ${debugOutput[color + "-hsluv-back"]},`);
  lines.push(`    'hpluv-back': ${debugOutput[color + "-hpluv-back"]},`);
  lines.push(`    'lch-from-hpluv': ${debugOutput[color + "-lch-from-hpluv"]}`);
  lines.push(`  )${last ? "" : ","}`);
});

lines.push(");\n");

const outputPath = path.join(__dirname, "test", "data", "_snapshot.scss");
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(
  `Snapshot written to ${outputPath} (${Object.keys(debugOutput).length} values)`
);
