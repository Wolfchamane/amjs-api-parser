# @amjs/api-parser 0.1.0

> Reads your API spec file and creates complete ORM solution files, using [@amjs/data-types](https://www.npmjs.com/package/@amjs/data-types)

## Installation

```bash
$ npm i -g @amjs/api-parser
```

## Usage

```bash
$ api-parser --src <path> --o <path> [options]
```

__Options__:

|Option|Description|
|:---:|:--- |
|`--s`, `--src`, `--source`|**API spec file or folder**|
|`--o`, `--out`, `--output`|**Output destination folder**|
|`--v`, `--verbose`|Enables debug information|
|`--nc`, `--no-clean`|Persists logs after execution (use with caution)|

## Supported API specs

Currently supported API specs are:
- [OpenApi](https://www.openapis.org/)
- _[JSONApi](https://jsonapi.org/)_ (WIP)
- _[RAML](https://raml.org/)_ (WIP)