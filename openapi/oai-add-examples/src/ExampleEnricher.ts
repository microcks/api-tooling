import { Oas30Document, Oas30Operation, Oas30Response, Oas30Example } from 'apicurio-data-models';

import { ExampleGenerator } from './ExampleGenerator';

/**
 * @author laurent
 */
export class ExampleEnricher {

  // Create a Generator !
  generator: ExampleGenerator = new ExampleGenerator();

  /**
   * 
   * @param oas3Document 
   */
  public enrichDocument(oas3Document: Oas30Document): any {
    // Enrich each and every operation from paths with examples.
    oas3Document.paths.getPathItems().forEach((item, index, items) => {
      console.log("\n Traversing path: " + item.getPath());
  
      if (item.get) {
        let operation: Oas30Operation = item.get as Oas30Operation;
        this.enrichOperation(operation);
      }
      if (item.post) {
        let operation: Oas30Operation = item.post as Oas30Operation;
        this.enrichOperation(operation);
      }
      if (item.put) {
        let operation: Oas30Operation = item.put as Oas30Operation;
        this.enrichOperation(operation);
      }
      if (item.delete) {
        let operation: Oas30Operation = item.delete as Oas30Operation;
        this.enrichOperation(operation);
      }
    });

  }

  /**
   * 
   * @param operation 
   */
  protected enrichOperation(operation: Oas30Operation) {
    operation.responses.getResponses().forEach((response, rIndex, responses) => {
      console.log("  -> Dealing with response " + response.getStatusCode());

      let oas3Response: Oas30Response = response as Oas30Response;
      oas3Response.getMediaTypes().forEach((mediaType, mtIndex, mediaTypes) => {
        let example: Oas30Example = mediaType.createExample(operation.operationId + "_" + response.getStatusCode());
        let exampleValue: any = this.generator.generate(mediaType.schema);
        let exampleStr: string = JSON.stringify(exampleValue, null, 2);
        console.log("     Adding example: \n" + exampleStr);
        example.value = exampleStr;
        mediaType.addExample(example);
      });
    });
  }
}