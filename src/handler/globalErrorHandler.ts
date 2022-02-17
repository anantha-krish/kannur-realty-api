import { ErrorRequestHandler } from "express";
import { IMessageResponse } from "../types";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    let message: string;
    if (process.env.NODE_ENV === "development") {
      message = err.message;
    } else {
      message = "Something went wrong! Please try again later";
    }
    const response: IMessageResponse = {
      status: "error",
      message: err.message,
    };

    res.status(500).json(response);
  }
};

export default globalErrorHandler;
