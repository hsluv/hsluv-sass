# HSLuv Sass
[![Build Status](https://travis-ci.org/hsluv/hsluv-sass.svg?branch=master)](https://travis-ci.org/hsluv/hsluv-sass)
[![Dependency Status](https://david-dm.org/hsluv/hsluv-sass.svg)](https://david-dm.org/hsluv/hsluv-sass)
[![devDependency Status](https://david-dm.org/hsluv/hsluv-sass/dev-status.svg)](https://david-dm.org/hsluv/hsluv-sass#info=devDependencies)
[![Package Version](https://img.shields.io/npm/v/hsluv-sass.svg)](https://www.npmjs.com/package/hsluv-sass)

Pure Sass [HSLuv](http://www.hsluv.org) implementation.

This package attempts to match the canonical implementation as closely as possible,
but not break sass best practices and common patterns. Important deviations
include

- RGB color components range from 0 to 255, not 0 to 1
- Testing precision is lowered significantly

## Usage

Some [docs](https://github.com/hsluv/hsluv-sass/wiki) for you to read.

### Installation

```
npm install hsluv-sass
```

### Example

Create `demo.csss`:

```scss
@import "./node_modules/hsluv-sass/src/hsluv";

.example {
  color: hsluv(23.2, 83.4%, 43.7%);
  background-color: hpluv(250.4, 100%, 59.1%);
}
```

```bash
$ npx sass demo.scss 
.example {
  color: #a84c27;
  background-color: #738fc0;
}
```

## Testing

Tested with [True](https://www.oddbird.net/true/docs/).
Continuous integration tests againsts latest and lts Node.js.

You can locally test after installing npm dependencies. Just run
`npm test`.

## Support

Have a question or need help? [Open an issue](https://github.com/hsluv/hsluv-sass/issues/new)

## License

This project is provided under the terms of the [MIT License](LICENSE).

Original version by **Cameron Little** · [Github](https://github.com/apexskier) · [Twitter](https://twitter.com/apexskier) · [CodePen](https://codepen.com/apexskier)
