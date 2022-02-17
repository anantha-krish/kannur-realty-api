import { NextFunction } from "express";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface IStatus {
  status: "success" | "error" | "failed";
}
export interface IMessageResponse extends IStatus {
  message: string;
}

export interface IApiResponse extends IStatus {
  result: any;
}

export type IApiController = {
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
    next?: NextFunction
  ): Promise<void>;
};
