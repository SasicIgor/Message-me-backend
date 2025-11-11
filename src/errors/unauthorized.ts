import { HttpError } from "./http.error";

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, "UnauthorizedError", 401);
  }
}
