# @emitty/language-nunjucks

> A [Nunjucks](https://mozilla.github.io/nunjucks) language support for @emitty.

## Install

```console
npm install @emitty/language-nunjucks
```

## Usage

```ts
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.njk', '.html'],
    parser: require('@emitty/language-nunjucks').parse
});
```

## Supported keywords

* [`include`](https://mozilla.github.io/nunjucks/templating.html#include)
* [`import`](https://mozilla.github.io/nunjucks/templating.html#import)
* [`extends`](https://mozilla.github.io/nunjucks/templating.html#extends)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
