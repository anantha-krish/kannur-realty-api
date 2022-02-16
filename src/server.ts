import { config } from "dotenv";
import { connect } from "mongoose";
import path from "path";
import app from "./app";
config({ path: path.resolve(__dirname, "../config.env") });

//update connection url with password
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

connect(DB, {
  //below options are added for avoiding warnings
  // useNewUrlParser: true,
  //useFindAndModify: true,
  //useCreateIndex: true,
  //useUnifiedTopology: true,
}).then(() => console.log("DB connected successfully"));

app.listen("8080", () => {
  console.log("listening at 8080");
});
