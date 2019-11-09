# @emitty/core

> Determine the inheritance of template and style files.

## Table of Contents

<details>
<summary><strong>Details</strong></summary>

* [Highlights](#highlights)
* [Donation](#donation)
* [Installation](#installation)
* [API](#api)
  * [`.configure`](#configureoptions)
  * [`.language`](#languagespecification)
  * [`.load`](#loadsnapshot)
  * [`.dump`](#dump)
  * [`.clear`](#clear)
  * [`.filter`](#filtersource-changed)
* [Options](#options-1)
  * [cwd](#cwd)
  * [fs](#fs)
* [FAQ](#faq)
  * [How does it works?](#how-does-it-works)
  * [How to use this with `gulp`?](#how-to-use-this-with-gulp)
  * [How to add my own language?](#how-to-add-my-own-language)
* [Changelog](#changelog)
* [License](#license)

</details>

## Highlights

* Simple and configurable.
* Language free.
* Support snapshots for postpone incremental builds.

## Donation

Do you like this project? Support it by donating, creating an issue or pull request.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/mrmlnc)

## Installation

```console
npm install @emitty/core
```

## Usage

```js
const emitty = require('@emitty/core').configure();

emitty.language({
    extensions: ['.pug', '.jade'],
    parser: require('@emitty/language-pug').parse
});

await emitty.filter('home.png'); // true
await emitty.filter('home.png', 'news.png'); // false
```

## API

### .configure([options])

Returns an Emitty instance with the methods described below.

#### [options]

* Required: `false`
* Type: `Options`

See [Options](#options-1) section.

### .language(specification)

Adds language support.

#### specification

* Required: `true`
* Type: `Language`

Specification of the language to be added.

> :1234: [How to add my own language?](#how-to-add-my-own-language)

```ts
export type Language = {
    extensions: string[]; // ['.pug', '.jade']
    parser: (filepath: string, buffer: Buffer) => { references: string[] };
};
```

### .load(snapshot)

Loads information from the snapshot to the storage.

#### snapshot

* Required: `true`
* Type: `Snapshot`

Snapshot storage.

### .dump()

Returns an object that contains a storage in the snapshot format.

### .clear()

Completely cleans the storage.

### .filter(source, [changed])

Determines whether to compile the changed file if it is passed.

> :1234: [How does it works?](#how-does-it-works)

#### source

* Required: `true`
* Type: `string`

The file that is currently being processed by the builder or compiler.

#### [changed]

* Required: `false`
* Type: `string`

The file that trigger the build or compile.

## Options

### cwd

* Type: `string`
* Default: `process.cwd()`

The current working directory.

### fs

* Type: `FileSystemAdapter`
* Default: `fs.*`

Custom implementation of methods for working with the file system.

```ts
export type FileSystemAdapter = {
    access?: typeof fs.access;
    constants?: typeof fs.constants;
    readFile?: typeof fs.readFile;
};
```

## FAQ

### How does it works?

The `.configure` method initiates a storage to which all relationships between the files being processed are later written.

When you call the `.filter` method without the `changed` file, @emitty reads the `source` file and builds a dependency tree for that file (with recursive reads of dependencies). In this case, the filter always returns `true` to ensure that all files in the project are compiled and collected in the storage.

When you call the `.filter` method with the `changed` file, @emitty reads only the `changed` file and updates its dependencies (without recursive reads of dependencies). In this case, the filter returns `true` if there is a reference to the `changed` file in the dependency tree of the `source` file. Otherwise `false`.

### How to use this with `gulp`?

Look at the [`gulp.js`](./examples/gulp.js) file for an example.

### How to add my own language?

You can use the `.language` method with any language, even your own. Just implement the parser for your language.

```js
export function myOwnLanguageParser(filepath: string, buffer: Buffer): Promise<{ references: string[] }> {
    return Promise.resolve({
        references: ['home.own.language', 'components/header.own.language']
    });
}
```

Next, just use it with the `.language` method.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/emitty/releases) for changelog for each release version.

## License

This software is released under the terms of the MIT license.
