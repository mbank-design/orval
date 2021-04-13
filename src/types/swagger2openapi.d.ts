declare module 'swagger2openapi' {
  import { OpenAPIObject } from 'openapi3-ts';
  interface ConvertObjCallbackData {
    openapi: OpenAPIObject;
  }
  function convertObj(
    schema: unknown,
    options: {},
    callback: (err: Error, data: ConvertObjCallbackData) => void,
  ): void;
}
