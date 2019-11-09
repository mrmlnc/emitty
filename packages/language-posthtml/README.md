# @emitty/language-posthtml

> A [PostHTML](https://github.com/posthtml/posthtml) language support for @emitty.

## Install

```console
npm install @emitty/language-posthtml
```

## Usage

```ts
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.html'],
    parser: require('@emitty/language-posthtml').parse
});
```

## Supported keywords

* [`module`](https://github.com/posthtml/posthtml-modules)
* [`include`](https://github.com/posthtml/posthtml-include)
* [`extends`](https://github.com/posthtml/posthtml-extend)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
