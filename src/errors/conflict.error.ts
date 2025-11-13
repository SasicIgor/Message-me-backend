import { HttpError } from "./http.error";

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, "ConflictError", 409);
  }
}
