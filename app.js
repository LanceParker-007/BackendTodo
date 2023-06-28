import express from "express";
// import admin from "./firebaseConfig.js";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

//Creating app
const app = express();
export default app;

//connecting db

//Config ENV file path
config({
  path: "./databaseConnection/config.env",
});

//Middleware
app.use(cookieParser());
app.use(express.json()); //Req.body
app.use(express.urlencoded({ extended: true })); //HTML forms

//Using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

//Normal routing api
app.get("/", async (req, res) => {
  return res.send("Hello Route Splitting and MVC");
});

//Using Error Middleware
app.use(errorMiddleware);

//Creating REST APIs

//App is listening here
