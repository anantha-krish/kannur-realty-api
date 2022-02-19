import express from "express";
import cors from "cors";
import globalErrorHandler from "./handler/globalErrorHandler";
import { fallback } from "./controller/fallback";
import apiRouter from "./routes/apiRouter";
import compression from "compression";
import multer from "multer";
import path from "path";
const app = express();

app.use(cors());
/** enable cors for pre-flight requests */
app.options("*", cors());
app.use(express.static(`${__dirname}/../public`));

app.use(express.json({ limit: "10kb" }));
//for form submissions
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);
app.use(compression());
//heroku https support
app.enable("trust proxy");
app.use("/api", apiRouter);
//fallback route
app.use("*", fallback);

app.use(globalErrorHandler);
export default app;
