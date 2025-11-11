export class BaseError extends Error {
  statusCode: number;
  //trusted error or not
  isOperational: boolean;

  constructor(
    message: string,
    name: string,
    statusCode: number,
    isOeprational: boolean
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOeprational;
    //logging error stack for debugging
    Error.captureStackTrace(this);
  }
}
