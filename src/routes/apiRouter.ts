import express from "express";
import {
  addImagePaths,
  addPlot,
  deleteImageByName,
  deletePlotById,
  getPlotById,
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
  .route("/plots/images/:fileName")
  .delete(catchAsyncErrors(deleteImageByName));

apiRouter
  .route("/plots/:id")
  .get(catchAsyncErrors(getPlotById))
  .delete(
    catchAsyncErrors(deletePlotById),
    catchAsyncErrors(deleteImageByName)
  );
export default apiRouter;
