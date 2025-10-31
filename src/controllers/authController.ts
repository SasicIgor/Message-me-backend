import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  res.status(201);
};

export const login = async (req: Request, res: Response) => {
  res.status(200);
};
