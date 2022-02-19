import Plots, { IPlot } from "../models/plot";
import { IApiController, IApiResponse, IMessageResponse } from "../types";
import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";
import { rm } from "fs";
import path from "path";

// use buffer before storing to disk
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    return callback(null, true);
  }
  return callback(new Error("Please upload an image file"));
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadPhotoHandler = upload.single("image");

export const addImagePaths: IApiController = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `plot-${Date.now()}.jpeg`;
  const imagePath = `public/images/${req.file.filename}`;
  const thumbnailPath = `public/thumbnail/${req.file.filename}`;

  await sharp(req.file.buffer)
    .resize(1024, 600)
    .toFormat("jpeg")
    .toFile(imagePath);

  await sharp(req.file.buffer)
    .resize(512, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(thumbnailPath);

  req.body.imagePath = imagePath;
  req.body.thumbnailPath = thumbnailPath;
  next();
};

export const getPlots: IApiController = async (__req, res) => {
  const plots = await Plots.find();
  const response: IApiResponse = {
    status: "success",
    result: plots,
  };
  res.status(200).json(response);
};

export const getPlotById: IApiController = async (req, res, next) => {
  const id = req.params.id.toString();
  const isValidId = mongoose.isValidObjectId(id);
  let plot;
  if (isValidId) plot = await Plots.find({ _id: id });
  if (!plot || !isValidId) {
    const response: IMessageResponse = {
      status: "failed",
      message: `Plot Not found with ${req.params.id}`,
    };
    res.status(404).json(response);
  } else if (plot && isValidId) {
    const response: IApiResponse = {
      status: "success",
      result: plot,
    };
    res.status(200).json(response);
  }
};

export const addPlot: IApiController = async (req, res) => {
  const newPlot = new Plots(req.body);

  const savedNewPlot = await newPlot.save({ validateBeforeSave: true });

  const response: IApiResponse = {
    status: "success",
    result: savedNewPlot,
  };
  res.status(201).json(response);
};

export const updatePlotDetails: IApiController = async (req, res, next) => {
  const id = req.params.id.toString();
  const isValidId = mongoose.isValidObjectId(id);
  let oldPlot;
  if (isValidId) oldPlot = await Plots.findById(id);
  if (!oldPlot) {
    res.status(404).json({ message: "Plot does not exist with this Id" });
    return next();
  }

  const updatedPlot = await Plots.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  const response: IApiResponse = {
    status: "success",
    result: updatedPlot,
  };
  if (updatedPlot.imagePath !== oldPlot.imagePath) {
    //cleanup task if image was updated
    const fileName = oldPlot?.imagePath.replace("public/images/", "");
    deleteFile(fileName);
  }
  //send response
  res.status(200).json(response);
};

const deleteFile = async (fileName: string) => {
  const folder = "../../public/";
  //remove original
  await rm(
    path.resolve(__dirname, folder, "images/", fileName),
    { force: true },
    (err) => {
      if (err) throw err;
    }
  );
  //remove thumbnail
  await rm(
    path.resolve(__dirname, folder, "thumbnail/", fileName),
    { force: true },
    (err) => {
      if (err) throw err;
    }
  );
};
export const deleteImageByName: IApiController = async (req, res, next) => {
  const fileName = req.params.fileName;
  deleteFile(fileName).catch(next);
  res.status(204).json({});
};

export const deletePlotById: IApiController = async (req, res, next) => {
  const id = req.params.id.toString();
  const isValidId = mongoose.isValidObjectId(id);
  let plot;
  if (isValidId) plot = await Plots.findById(id);
  if (!isValidId || !plot) {
    const response: IMessageResponse = {
      status: "failed",
      message: `Plot Not found with ${req.params.id}`,
    };
    res.status(404).json(response);
  } else if (isValidId) {
    await Plots.findByIdAndDelete(id);
    const fileName = plot?.imagePath.replace("public/images/", "");
    deleteFile(fileName).catch(next);
    res.status(204).json({
      status: "success",
    });
  }
};
