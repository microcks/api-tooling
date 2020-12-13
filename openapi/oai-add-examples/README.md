## What is it ?

A simple tool demontrating how to usae [Apicurio Data Models](https://www.npmjs.com/package/apicurio-data-models) for manipulating OpenAPI v3.0 document and adding examples to them.

In order to bootstrap usage of Microcks, you may want to initialize OpenAPI stubs (written from scratch or generated from another format like RAML ;-)) with examples. Thus you may want to have a look at this tool.

## Build it

First install the required dependencies with:

```sh
npm install
```

## Compile it

Just compile this Typescript libray using:

```sh
npm run build-ts
```

This should produce a `dist/` folder.

## Run it

Run the default sample using the command below:

```sh
node dist/main.js
```

This will read the `songs-oas3.json` sample OpenAPI v3 specifiaction file and produced an enriched version with examples into the `songs-oas3-with-examples.json` file.

If you want to specify you own input and output files, just run:

```sh
node dist/main.js <my-input-file.json> <my-output-file.json>
```