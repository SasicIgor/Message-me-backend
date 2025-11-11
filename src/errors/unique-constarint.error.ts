import { DatabaseError } from "./database.error";

export class UniqueConstraintError extends DatabaseError {
  field: string;
  value: any;

  constructor(field: string, value: any) {
    super(`${field} with a value: '${value}' already exists`);
    this.name = "UniqueConstraintError";
    this.field = field;
    this.value = value;
  }
}