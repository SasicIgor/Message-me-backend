import { DatabaseError } from "./database.error.ts";

export class UniqueConstraintError extends DatabaseError {
  constructor(detail: string) {
    super(`${detail}`);
    this.name = "UniqueConstraintError";
  }
}
