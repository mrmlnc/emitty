# @emitty/language-pug

> A [Pug](https://pugjs.org) language support for @emitty.

## Install

```console
npm install @emitty/language-pug
```

## Usage

```ts
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.pug', '.jade'],
    parser: require('@emitty/language-pug').parse
});
```

## Supported keywords

* [`include`](https://pugjs.org/language/includes.html)
* [`extends`](https://pugjs.org/language/inheritance.html)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
