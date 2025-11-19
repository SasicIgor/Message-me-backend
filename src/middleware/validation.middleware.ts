import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { ServerError } from "../errors/server.error.ts";

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new BadRequestError(error.message));
      }
      next(new ServerError("Server error!"));
    }
  };
};

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      console.log(1);
      if (error instanceof ZodError) {
        return next(new BadRequestError("Invalid UUID format for message or chat"));
      }
      next(new ServerError("Server error!"));
    }
  };
};
