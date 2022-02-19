import { model, Schema } from "mongoose";
export interface IPlot {
  title: string;
  landmark: string;
  description: string;
  imagePath: string;
  thumbnailPath: string;
}
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
  imagePath: { type: String },
  thumbnailPath: { type: String },
});

const Plots = model<IPlot>("Plots", PlotSchema);
export default Plots;
