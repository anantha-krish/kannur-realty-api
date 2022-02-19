import express from "express";
import {
  addImagePaths,
  addPlot,
  deletePlotById,
  getPlotById,
  getPlotGallery,
  getPlots,
  uploadPhotoHandler,
} from "../controller/apiController";
import { catchAsyncErrors } from "../utils";

const apiRouter = express.Router();

apiRouter
  .route("/plots")
  .get(catchAsyncErrors(getPlots))
  .post(uploadPhotoHandler, addImagePaths, catchAsyncErrors(addPlot));

apiRouter
  .route("/plots/:id")
  .get(catchAsyncErrors(getPlotById))
  .delete(catchAsyncErrors(deletePlotById));
export default apiRouter;
