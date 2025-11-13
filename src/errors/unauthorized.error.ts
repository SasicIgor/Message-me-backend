import { HttpError } from "./http.error.ts";

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, "UnauthorizedError", 401);
  }
}
