import { IRouterHandler, RequestHandler } from "express";
import { IMessageResponse } from "../types";

export const fallback: RequestHandler = (req, res) => {
  const response: IMessageResponse = {
    status: "failed",
    message: `Server does not support ${req.originalUrl}`,
  };
  res.status(404).json(response);
};
