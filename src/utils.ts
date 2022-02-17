import { NextFunction } from "express";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IApiController } from "./types";

export const catchAsyncErrors =
  (fn: IApiController) =>
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
    next: NextFunction
  ): Promise<void> =>
    fn(req, res).catch(next);
