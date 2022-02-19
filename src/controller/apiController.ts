import Plots, { IPlot } from "../models/plot";
import { IApiController, IApiResponse, IMessageResponse } from "../types";
import mongoose from "mongoose";
import { readFile, readFileSync } from "fs";
import multer from "multer";
import { nextTick } from "process";
import sharp from "sharp";

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

export const getPlotGallery: IApiController = async (__req, res) => {
  const plot = await Plots.find().select("image");

  // const response: IApiResponse = {
  //   status: "success",
  //   result: plots,
  // };
  res.status(200).json(plot);
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

export const deletePlotById: IApiController = async (req, res) => {
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
    res.status(204).json({
      status: "success",
    });
  }
};
