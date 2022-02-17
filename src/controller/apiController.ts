import { RequestHandler } from "express";
import url from "url";
import { nextTick } from "process";
import Plots from "../models/plot";
import { IApiController, IApiResponse, IMessageResponse } from "../types";
import mongoose from "mongoose";

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
