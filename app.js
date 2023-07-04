import express from "express";
// import admin from "./firebaseConfig.js";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

//Creating app
const app = express();

//connecting db

//Config ENV file path
config({
  path: "./config.env",
});

//Middleware
app.use(express.json()); //Req.body
app.use(cookieParser());
app.use(cors());
// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
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
export default app;
