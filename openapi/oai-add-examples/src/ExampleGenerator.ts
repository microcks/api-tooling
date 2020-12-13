import { OasSchema, ReferenceUtil } from "apicurio-data-models";

export class ExampleGenerator {

  private refStack: any[] = [];

  public generate(schema: OasSchema): any {
    console.debug("[ExampleGenerator] Generating example from schema of type: ", schema.type);
    let object: any;
    if (schema.$ref) {
      object = this.generateFromRef(schema);
    } else if (this.isEnum(schema)) {
      console.debug("[ExampleGenerator] Schema is enum.");
      object = this.generateEnumValue(schema);
    } else if (this.isSimpleType(schema.type)) {
      console.debug("[ExampleGenerator] Schema is a simple type.");
      object = this.generateSimpleType(schema.type, schema.format);
    } else if (schema.type === "object" || !schema.type) {
      console.debug("[ExampleGenerator] Schema is type 'object'");
      object = this.generateObject(schema);
    } else if (schema.type === "array") {
      console.debug("[ExampleGenerator] Schema is type 'array'");
      object = this.generateArray(schema);
    }
    return object;
  }

  private generateFromRef(schema: OasSchema): any {
    if (this.refStack.indexOf(schema.$ref) !== -1) {
      return {};
    }
    let refSchema: OasSchema = ReferenceUtil.resolveRef(schema.$ref, schema) as OasSchema;
    if (refSchema) {
      console.debug("[ExampleGenerator] Successfully resolved $ref: ", schema.$ref);
      this.refStack.push(schema.$ref);
      let rval: any = this.generate(refSchema);
      this.refStack.pop();
      return rval;
    } else {
      return {};
    }
  }

  private generateObject(schema: OasSchema): any {
    let object: any = {};
    if (schema.properties) {
      console.debug("[ExampleGenerator] Schema has properties.");
      Object.keys(schema.properties).forEach(propertyName => {
        console.debug("[ExampleGenerator] Processing schema property named: ", propertyName);
        let propertyExample: any = this.generate(schema.properties[propertyName] as OasSchema);
        object[propertyName] = propertyExample;
      });
    }
    return object;
  }

  private generateArray(schema: OasSchema): any {
    let object: any[] = [];
    if (schema.items) {
      // Push two objects into the array...
      object.push(this.generate(schema.items as OasSchema));
      object.push(this.generate(schema.items as OasSchema));
    }
    return object;
  }

  private isSimpleType(type: string): boolean {
    const simpleTypes: string[] = [
      "string", "boolean", "integer", "number"
    ]
    return simpleTypes.indexOf(type) !== -1;
  }

  private isEnum(schema: OasSchema): boolean {
    return schema.enum_ && schema.enum_.length > 0;
  }

  private generateEnumValue(schema: OasSchema): any {
    if (schema.enum_.length > 0) {
      return schema.enum_[Math.floor(Math.random() * schema.enum_.length)];
    }
    return "??";
  }

  private generateSimpleType(type: string, format: string): any {
    let key: string = type;
    if (format) {
      key = type + "_" + format;
    }
    switch (key) {
      case "string":
        return "some text";
      case "string_date":
        return "2018-01-17";
      case "string_date-time":
        return "2018-02-10T09:30Z";
      case "string_password":
        return "**********";
      case "string_byte":
        return "R28gUGF0cyE=";
      case "string_binary":
        return "<FILE>";
      case "integer":
      case "integer_int32":
      case "integer_int64":
        return Math.floor(Math.random() * Math.floor(100));
      case "number":
      case "number_float":
      case "number_double":
        return Math.floor((Math.random() * 100) * 100) / 100;
      case "boolean":
        return true;
      default:
        return "";
    }
  }

}