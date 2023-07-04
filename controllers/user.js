import admin from "../databaseConnection/firebaseConfig.js";
const db = admin.firestore();
const userCollectionRef = db.collection("Users");
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import User from "../models/user.js";
import ErrorHandler from "../middlewares/error.js";
// import jwt from "jsonwebtoken";

//All functions
// export const getAllUsers = async (req, res) => {};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Fields are empty", 400));
    }

    const userRef = await userCollectionRef.where("email", "==", email).get();
    if (userRef.empty) {
      return next(new ErrorHandler("Invalid email", 400));
      // return res.status(404).json({
      //   success: false,
      //   message: "Invalid email. Please try again.",
      // });
    }

    const user = userRef.docs[0];
    const isMatch = await bcrypt.compare(password, user.data().password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid password", 400));
      // return res.status(404).json({
      //   success: false,
      //   message: "Invalid password. Please try again.",
      // });
    }

    sendCookie(user, res, `Welcome back ${user.data().name}`, 201);
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("The fields are empty", 400));
    // return res.json({
    //   success: false,
    //   message: "The fields are empty.",
    // });
  }

  try {
    let userRef = await userCollectionRef.where("email", "==", email).get();

    if (userRef.size > 0) {
      return next(new ErrorHandler("User already exists", 409));
      // return res.status(400).json({
      //   success: false,
      //   message: "User already exists",
      // });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User(name, email, hashedPassword);
      userRef = await userCollectionRef.add({ ...newUser });
      sendCookie(userRef, res, "Registered Successfully.", 201);
    }
  } catch (err) {
    return next(new ErrorHandler("Some error occured.", 400));
    // return res.status(400).json({
    //   success: false,
    //   error: err,
    // });
  }
};

export const getMyProfile = (req, res) => {
  //Have to do this work again again in the future for every protected route so we will create a middleware isAuthenticated
  //   const { token } = req.cookies;
  //   if (!token) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Not logged in. Login first",
  //     });
  //   }
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const id = decoded._id;
  //     const user = userCollectionRef.doc(id).get();
  //     return res.status(200).json({ success: true, user });
  //   } catch (err) {
  //     console.error("Error decoding token:", err);
  //     res.status(404).json({
  //       success: false,
  //       error: err,
  //     });
  //   }

  //   All of the above code replaced by single line
  return res.status(200).json({ success: true, user: req.user });
};

export const logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({ success: true, user: req.user, message: "Logout successful!" });
};
