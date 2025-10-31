import express from "express";

import authRoutes from "./routes/authRoutes.ts";

const app = express();

//routes
app.use("/api/auth", authRoutes);

export default app;
