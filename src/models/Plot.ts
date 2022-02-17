import { model, Schema } from "mongoose";
interface IPlot {
  title: string;
  landmark: string;
  description: string;
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
});

const Plots = model<IPlot>("Plots", PlotSchema);
export default Plots;
