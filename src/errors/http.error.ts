import { BaseError } from "./base.error.ts";

export class HttpError extends BaseError {
  constructor(message: string, name: string, statusCode: number) {
    super(message, name, statusCode, true);
  }
}
