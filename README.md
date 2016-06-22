HUSL Sass [![Build Status](https://travis-ci.org/apexskier/husl-sass.png?branch=master)](https://travis-ci.org/apexskier/husl-sass) [![Dependency Status](https://david-dm.org/apexskier/husl-sass.png)](https://david-dm.org/apexskier/husl-sass) [![devDependency Status](https://david-dm.org/apexskier/husl-sass/dev-status.png)](https://david-dm.org/apexskier/husl-sass#info=devDependencies)
========

Pure Sass [HUSL](http://www.husl-colors.org) implementation.

This package attempts to match the canonical implementation as closely as possible,
but not break sass best practices and common patterns. Important deviations
include

- RGB color components range from 0 to 255, not 0 to 1
- Testing precision is lowered significantly

## Usage

Some [docs](https://github.com/apexskier/husl-sass/wiki) for you to read.

### Installation

This depends on [mathsass](https://github.com/terkel/mathsass), and requires
an npm setup that allows multilevel sass imports. [Eyeglass](https://github.com/sass-eyeglass/eyeglass) may be a method for this.

```
npm install apexskier/husl-sass
```

### Example

```sass
@import "../node_modules/husl-sass/src/husl";

.example {
  color: husl(23.2, 83.4%, 43.7%);
  background-color: huslp(250.4, 100%, 59.1%);
}
```

## Testing

Tested with [apexskier's bootcamp](https://github.com/apexskier/bootcamp).
Continuous integration tests run in the last few versions of ruby sass and
node-sass.

You can locally test after installing npm dependencies. Just compile
`test/specs.scss` with your favorite sass compiler. If it fails on master, add
your compiler to the [travis config](https://github.com/apexskier/husl-sass/blob/master/.travis.yml) and
[submit a PR](https://github.com/apexskier/husl-sass/pulls) or [raise an issue](https://github.com/apexskier/husl-sass/issues/new).

## Support

Have a question or need help? Tweet [@apexskier](https://twitter.com/apexskier).

## License

This project is provided under the terms of the [MIT License](LICENSE).

---

 by **Cameron Little** · [Github](https://github.com/apexskier) · [Twitter](https://twitter.com/apexskier) · [CodePen](https://codepen.com/apexskier)
