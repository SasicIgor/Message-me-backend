import { HttpError } from "./http.error.ts";

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(message, "InternalServerError", 500);
  }
}
