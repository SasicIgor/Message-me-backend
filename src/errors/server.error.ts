import { HttpError } from "./http.error.ts";

export class ServerError extends HttpError {
  constructor(message: string) {
    super(message, "InternalServerError", 500);
  }
}
