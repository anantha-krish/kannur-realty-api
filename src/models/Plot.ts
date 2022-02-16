import { model, Schema } from "mongoose";

const PlotSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Plots = model("Plots", PlotSchema);
export default Plots;
