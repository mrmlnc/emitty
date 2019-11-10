# emitty

> Monorepo for @emitty.

## What is @emitty?

A platform for finding dependencies between files and building tools for incremental compilation or build.

## Why does this project exist?

Most HTML and CSS preprocessors use a synchronous API to access file system and don't use cache for already read files.
It degrades performance and increases the time required to compile the code.

Also, when your project is very large and has a large number of dependencies between components (e.g. many imports) — compiles all files of a project may take seconds or even minutes. This is unacceptable if you are working with a "watch" mode.

This monorepo contains tools that allows you to compile only those files that depend on the changed file and require compilation.

For example, if you have the following files:

```js
templates/
├── home.pug // include components/header
├── news.pug // include components/header
└── components/
    └── header.pug
```

If you change the `home.pug` file, then will be compiled only it. If you change the `components/header.pug` file, then will be compiled `home.pug` and `news.pug` files.

## How to use it?

For details on how to configure the tools, see the [`@emitty/core`](./packages/core) documentation.

## Packages

* [`core`](./packages/core) — Package to find dependencies between files.

## Languages

* [Nunjucks](./packages/language-nunjucks)
* [PostHTML](./packages/language-posthtml)
* [Pug](./packages/language-pug)
* [Less](./packages/language-less)
* [SCSS](./packages/language-scss)

## Want to report a bug or request a feature?

Please read through our [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Want to contribute to @emitty?

Check out our [CONTRIBUTING.md](.github/CONTRIBUTING.md) to get started with setting up the repo.
