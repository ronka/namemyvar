# namemyvar

NameMyVar is an NPM package for naming variables using artificial intelligence.

## Installation

You can install NameMyVar globally using npm:

```bash
npm install -g namemyvar
```

afterwords you will need to set your OpenAI API key as an environment variable.
(Retrieve your API key from [OpenAI](https://platform.openai.com/account/api-keys))

### Set OpenAPI key

#### Windows

`SET OPENAI_KEY=your_key`

#### Mac

`EXPORT OPENAI_KEY=your_key`

## Usage

```bash
namemyvar <code-description> [options]
```

### Options

- `--type, -t`: The type of the variable, such as boolean, function, number, etc.
- `--language, -l`: The language in which the variable name is going to be used.

### Examples

```bash
namemyvar check if reached limit of comments per day -t boolean -l javascript

Generating name ...

▪ maxCommentsPerDay
```
