import { HttpError } from "./http.error.ts";

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, "BadRequestError", 400);
  }
}
