'use strict';

var fs = require('fs');

import { Document, Library, Oas30Document, Oas30Operation, Oas30Response, Oas30Example } from 'apicurio-data-models';
import { ExampleEnricher } from './ExampleEnricher';

// Retrieve CLI arguments.
var commandArgs = process.argv.slice(2);

const oasFileIn = commandArgs[0] || 'songs-oas3.json'
const oasFileOut = commandArgs[1] || 'songs-oas3-with-examples.json'

let openApiData: string = fs.readFileSync(oasFileIn, {encoding: 'utf-8'});
let document: Document = Library.readDocumentFromJSONString(openApiData);

console.log("Processing OpenAPI '" + document.info.title + " - " + document.info.version + "'...");

// Ensure Document is OpenAPI v3 document.
let oas3Document = document as Oas30Document; 
console.log("-> Checking if OpenAPI 3 document: " + oas3Document.is3xDocument());

// Enriche the document with examples.
let enricher: ExampleEnricher = new ExampleEnricher();
enricher.enrichDocument(oas3Document);

// Write changes to file.
//var modifiedOpenApiData = Library.writeDocumentToJSONString(document); // No pretty print.
var modifiedOpenApiData = JSON.stringify(Library.writeNode(document), null, 2);
fs.writeFileSync(oasFileOut, modifiedOpenApiData , 'utf-8');
