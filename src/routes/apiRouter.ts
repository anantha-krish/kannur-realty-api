import express from "express";
import {
  addPlot,
  deletePlotById,
  getPlotById,
  getPlots,
} from "../controller/apiController";
import { catchAsyncErrors } from "../utils";

const apiRouter = express.Router();

apiRouter
  .route("/plots")
  .get(catchAsyncErrors(getPlots))
  .post(catchAsyncErrors(addPlot));

apiRouter
  .route("/plots/:id")
  .get(catchAsyncErrors(getPlotById))
  .delete(catchAsyncErrors(deletePlotById));
export default apiRouter;
