# @emitty/language-less

> A [Less](http://lesscss.org) language support for @emitty.

## Install

```console
npm install @emitty/language-less
```

## Usage

```ts
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.less'],
    parser: require('@emitty/language-less').parse
});
```

## Supported keywords

* [`import`](http://lesscss.org/features/#import-atrules-feature)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
