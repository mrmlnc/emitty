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

#### directory

  * Type: `string`
  * Default: `null`

Directory to start from.

#### language

  * Type: `string` or `object`
  * Default: `null`

The settings for the language that you want to use. For more details see [«Language»](#language-1) section.

#### options

  * Type: `object`
  * Default: `{}`

For more details see [«Options»](#options-1) section.

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
> If you do not specify the path to the file is changed, it will be the last file that has changed since the last scan.

```js
const stream = emitty.stream();
stream.on('end', () => {
  // console.log(emitty.keys());
  // ['a.pug', 'b.pug']
});

stream.end();
```

## Options

#### snapshot

  * Type: `object`
  * Default: `{}`

You can load the previous state of the project in the Storage using this option.

#### log

  * Type `function`
  * Default: `(filepath) => console.log`

**Only for Stream mode**. The function that will be called if the file needs to be compiled.

#### cleanupInterval

  * Type: `number`
  * Default: `null`

Time interval over which the Storage will be cleared of obsolete items.

> **Tip**
>
> Recommended for projects of more than 1000 template files or projects, where often remove the template files (more than once in 10 minutes).

#### scanner.depth

  * Type: `number`
  * Default: `30`

**This option can affect performance.** The maximum number of nested directories to scan.

#### scanner.exclude

  * Type: `strin[]`
  * Default: `['.git', '**/node_modules', '**/bower_components']`

**This option can affect performance.** List of Glob-patterns for directories that are excluded when scanning.

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

#### [extends]

  * Type: `string`
  * Default: `null`

The name of built-in config, which will be basis for this config. If you specify this property, you can specify other properties **as needed**.

#### extensions

  * Type: `string[]`
  * Default: `null`

List of file extensions to be included in Storage when scanning.

#### matcher

  * Type: `RegExp`
  * Default: `null`

Regexp to run on each line of source code to match dependency references.

#### comments

  * Type: `object`
  * Default: `null`

```js
{
  start: '//', // The start of a comment
  end: '' // The end of a comment
}
```

#### [indentBased]

  * Type: `boolean`
  * Default: `false`

The syntax of the language is based on indentation?

## How to use with Gulp

```js
// npm i gulpjs/gulp#4.0 gulp-if gulp-pug emitty
const gulp = require('gulp');
const gulpif = require('gulp-if');
const emitty = require('emitty').setup('app/templates', 'pug');
const pug = require('gulp-pug');

// Your "watch" task
gulp.task('watch', () => {
  // Shows that run "watch" mode
  global.watch = true;

  gulp.watch('app/templates/**/*.pug', gulp.series('templates'))
    .on('all', (event, filepath) => {
      global.emittyChangedFile = filepath;
    });
});

gulp.task('templates', () =>
  gulp.src('app/templates/*.pug')
    .pipe(gulpif(global.watch, emitty.stream(global.emittyChangedFile)))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('build'))
);
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
