import { RequestHandler } from "express";
import { IMessageResponse } from "../types";

export const fallback: RequestHandler = (req, res) => {
  let response: IMessageResponse = {
    status: "failed",
    message: `Server does not support ${req.originalUrl}`,
  };
  // trying to acces ftp server
  if (req.originalUrl.startsWith("/public")) {
    response = {
      status: "failed",
      message: "File Not found! Either Deleted or Moved",
    };
  }
  res.status(404).json(response);
};
