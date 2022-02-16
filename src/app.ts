import express from "express";
import cors from "cors";
import Plots from "./models/Plot";

const app = express();

app.use(express.json());
app.use(cors());

app.route("/api").get(async (req, res) => {
  // const plot = new Plots({
  //   title: "test",
  //   description: "test description",
  //   landmark: "10km test",
  // });
  // await plot.save();

  res.status(200).json({
    message: "Hello world",
  });
});

export default app;
