import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `route not found: ${req.method} ${req.path}` });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
};
