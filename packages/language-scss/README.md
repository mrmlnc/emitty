# @emitty/language-scss

> A [SCSS](https://sass-lang.com) language support for @emitty.

## Install

```console
npm install @emitty/language-scss
```

## Usage

```ts
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.scss'],
    parser: require('@emitty/language-scss').parse
});
```

## Supported keywords

* [`import`](http://lesscss.org/features/#import-atrules-feature)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
