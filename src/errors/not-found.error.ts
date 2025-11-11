import { HttpError } from "./http.error.ts";

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, "NotFoundError", 404);
  }
}
