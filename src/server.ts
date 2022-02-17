import { config } from "dotenv";
import { connect } from "mongoose";
import path from "path";
import app from "./app";
config({ path: path.resolve(__dirname, "../config.env") });

//handle runtime exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION!!! App is going to shutdown 🧨");
  //exit immediately as node is not in clean state
  process.exit(1);
});

//update connection url with password
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

connect(DB).then(() => console.log("DB connected successfully"));
const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`listening at ${port}`);
});
//handle runtime rejections (Ex: DB connection failure)
process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED EXCEPTION!!! App is going to shutdown 🧨");
  //gracefully shutdown, process pending requests first
  server.close(() => process.exit(1));
});

//handle HEROKU Dyno restart
process.on("SIGTERM", () => {
  console.log("SIGTERM recieved! app will shutdown gracefully");
  server.close(() => {
    console.log("Shutdown completed!!!");
  });
});
