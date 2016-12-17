# emitty

> Determine the inheritance of template and style files.

## What is it? or what is problem?

Most HTML and CSS preprocessors use a synchronous API to access file system and don't use cache for already read files.
It degrades performance and increases the time required to compile the code.

Also, when your project is very large and has a large number of dependencies between blocks (e.g. many mixins) — compiles all files of a project may take seconds or even minutes.
This is unacceptable if you are working with a "watch" mode.

**Solution?**

This module allows you to compile only those files that depend on the changed file and require compilation.

For example, if you have the following files:

  * templates/
    * `a.pug` — depends on `b.pug`
    * `b.pug`
    * `c.pug`

If you change the `c.pug` file, then will be compiled only it. If you change the `b.pug` file, then will be compiled `a.pug` file.

## Install

```
$ npm i -D emitty
```

## Why?

  * See [«What is it? or what is problem?»](#what-is-it-or-what-is-problem) section.
  * This solution does not use redundant modules such as Pug parser and Glob.
  * Sufficiently flexible.

## Usage

```js
const emitty = require('emitty').setup('templates', 'jade');

emitty.scan().then(() => {
  console.log(emitty.storage());
  // {
  //   'a.pug': {
  //     dependencies: ['components/b.pug'],
  //     ctime: new Date()
  //   },
  //   'components/b.pug': {
  //     dependencies: [],
  //     ctime: new Date()
  //   }
  // }
  }
});
```

## Setup

### setup(directory, language, [options])

Creates API for **emitty**.

| Parameter   | Type                 | Default | Required | Description |
|:-----------:|:--------------------:|:-------:|:--------:|:------------|
| `directory` | `String`             | `null`  | +        | Directory to start from. |
| `language`  | `String` or `Object` | `null`  | +        | The settings for the language that you want to use. For more details see [«Language»](#language) section. |
| `[options]` | `Object`             | `{}`    | -        | For more details see [«Options»](#options) section. |

## API

```js
const emitty = require('emitty').setup('templates', 'pug');
```

### storage()

Returns a snapshot of the Storage.

```js
console.log(emitty.storage());
// {
//   'a.pug': {
//     dependencies: ['components/b.pug'],
//     ctime: new Date()
//   },
//   'components/b.pug': {
//     dependencies: [],
//     ctime: new Date()
//   }
// }
```

### keys()

Returns the keys of the Storage.

```js
console.log(emitty.keys());
// ['a.pug', 'components/b.pug']
```

### load(snapshot)

Clears the Storage and loads the new data.

```js
emitty.load({
  'c.pug': {
    dependencies: ['nope.pug'],
    ctime: new Date()
  }
});
// console.log(emitty.keys());
// ['c.pug']
```

### scan([filepath], [stats]) => Promise

Scans directory and updates the Storage. If you specify a `filepath`, then only that file will be scanned. Also you can specify `stats` of file (to avoid doing unnecessary actions inside **emitty**).

```js
emitty.scan().then(() => {
  // console.log(emitty.keys());
  // ['a.pug', 'b.pug']
});
```

### resolver

#### getDependencies(filepath)

Returns all files that depends on the specified file.

```js
emitty.scan().then(() => {
  console.log(emitty.getDependencies('a.pug'));
  // ['components/b.pug']
});
```

#### checkDependencies(a, b)

Returns True if A depends on B.

```js
emitty.scan().then(() => {
  console.log(emitty.getDependencies('a.pug'));
  // ['components/b.pug']
  console.log(emitty.checkDependencies('a.pug', 'components/b.pug'));
  // true
  console.log(emitty.checkDependencies('a.pug', 'nope.pug'));
  // false
});
```

### stream([filepath], [stats]) => TransformStream

Is [scan](#scanfilepath-stats--promise) method, but for Stream and combines `scan` + `resolver`.

Scans directory or file and updates the Storage. Then, if file in stream depends on the changed file — pass it further. Else skip it.

> **Warning**
>
> If you do not specify the filepath to the changed file, it will be the last file that has changed since the last scan.

```js
const stream = emitty.stream();
stream.on('end', () => {
  // console.log(emitty.keys());
  // ['a.pug', 'b.pug']
});

stream.end();
```

## filter(filepath) => TransformStream

Passes continue to stream only those files that need to be compiled.

## Options

| Option            | Type       | Default                                              | For Stream | Description |
|:-----------------:|:----------:|:----------------------------------------------------:|:----------:|:------------|
| `snapshot`        | `Object`   | `{}`                                                 | -          | You can load the previous state of the project in the Storage using this option. |
| `log`             | `Function` | `console.log`                                        | +          | The function that will be called if the file needs to be compiled. |
| `cleanupInterval` | `Number`   | `null`                                               | -          | Time interval over which the Storage will be cleared of obsolete items. Recommended for projects very big projects. |
| `makeVinylFile`   | `Boolean`  | `false`                                              | +          | You can use `gulp.src('patterns', { read: false })` to reduce access for filesystem. This option creates a Vinyl file within a Stream. |
| `scanner.depth`   | `Number`   | `30`                                                 | -          | The maximum number of nested directories to scan. |
| `scanner.exclude` | `String[]` | `['.git', '**/node_modules', '**/bower_components']` | -          | List of Glob-patterns for directories that are excluded when scanning. |

## Language

### Built-in configs

The **emitty** contains built-in configs for the following instruments:

  * `jade` — now it's Pug
  * [`pug`](https://pugjs.org)
  * [`nunjucks`](https://mozilla.github.io/nunjucks)
  * [`posthtml`](https://github.com/posthtml/posthtml) — with `posthtml-include` and/or `posthtml-extend` plugin.
  * [`sugarml`](https://github.com/posthtml/sugarml) — with `posthtml-include` and/or `posthtml-extend` plugin.
  * [`less`](http://lesscss.org/)
  * [`stylus`](http://stylus-lang.com/) — indent based syntax
  * [`sass`](http://sass-lang.com/)
  * [`scss`](http://sass-lang.com/)

You can use them when you configure **emitty**:

```js
const emitty = require('emitty');
const emittyJade = emitty.setup('templates', 'pug');
const emittySugarml = emitty.setup('templates', 'sugarml');
// ...
```

### Your own config

Instead of use built-in config you can specify your own config.

For example, config for [Slm](https://github.com/slm-lang/slm):

```js
const emitty = require('emitty').setup('templates', {
  extensions: ['.slm'],
  matcher: /=?=\s(?:partial|extend)\(['"]([^'"]+)['"].*?\)/,
  comments: {
    start: '/',
    end: ''
  },
  indentBased: true
});
```

| Property         | Type       | Default | Required | Description |
|:----------------:|:----------:|:-------:|:--------:|:------------|
| `[extends]`      | `String`   | `null`  | -        | The name of built-in config, which will be basis for this config. If you specify this property, you can specify other properties **as needed**. |
| `extensions`     | `String[]` | `null`  | +        | List of file extensions to be included in Storage when scanning. |
| `matcher`        | `RegExp`   | `null`  | +        | Regexp to run on each line of source code to match dependency references. |
| `comments.start` | `String`   | `null`  | +        | The start of a comment. |
| `comments.end`   | `String`   | `null`  | +        | The end of a comment. |
| `[indentBased]`  | `Boolean`  | `false` | -        | The syntax of the language is based on indentation? |

## How to use with Gulp

  * [Minimal](https://github.com/mrmlnc/emitty/blob/master/examples/stream-minimal.js)
  * [Basic](https://github.com/mrmlnc/emitty/blob/master/examples/stream-basic.js)
  * [Advanced](https://github.com/mrmlnc/emitty/blob/master/examples/stream-advanced.js)
  * [Performance](https://github.com/mrmlnc/emitty/blob/master/examples/stream-performance.js) (recommended)
  * [Ninja](https://github.com/mrmlnc/emitty/blob/master/examples/stream-ninja.js)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
