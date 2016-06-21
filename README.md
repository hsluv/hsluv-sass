HUSL Sass [![Build Status](https://travis-ci.org/apexskier/husl-sass.png?branch=master)](https://travis-ci.org/apexskier/husl-sass) [![Dependency Status](https://david-dm.org/apexskier/husl-sass.png)](https://david-dm.org/apexskier/husl-sass) [![devDependency Status](https://david-dm.org/apexskier/husl-sass/dev-status.png)](https://david-dm.org/apexskier/husl-sass#info=devDependencies)
========

Pure Sass [HUSL](http://www.husl-colors.org) implementation.

This package attempts to match the canonical implementation as closely as possible,
but not break sass best practices and common patterns. Important deviations
include

- RGB color components range from 0 to 255, not 0 to 1
- Testing precision is lowered significantly

## Usage

```
npm install apexskier/husl-sass
```

```sass
@import "../node_modules/husl-sass/src/husl";

.my-class {
  color: husl-from-hex(#abc123);
}
```

## Testing

```
npm test
```

Tested with [apexskier's bootcamp](https://github.com/apexskier/bootcamp).
Continuous integration tests run in the last few versions of ruby sass and node-sass.

## Support

Have a question or need help? Tweet [@apexskier](https://twitter.com/apexskier).

## License

This project is provided under the terms of the [MIT License](LICENSE).

---

 by **Cameron Little** · [Github](https://github.com/apexskier) · [Twitter](https://twitter.com/apexskier) · [CodePen](https://codepen.com/apexskier)
