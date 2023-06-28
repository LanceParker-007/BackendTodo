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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "The fields are empty.",
    });
  }

  try {
    let userRef = await userCollectionRef.where("email", "==", email).get();
    if (userRef.empty) {
      return next(new ErrorHandler("Invalid email", 400));
    } else {
      //   console.log(password); //recieved password from frontend
      //   console.log(userRef.docs[0].data().password); //recieved password from Records
      const user = userRef.docs[0];
      const isMatch = await bcrypt.compare(password, user.data().password);
      if (isMatch) {
        sendCookie(user, res, `Welcome back ${user.data().name}`, 201);
      } else {
        return next(new ErrorHandler("Invalid password", 400));
      }
    }
  } catch (err) {
    return next(
      new ErrorHandler(
        `Some error occured while logging in the user: ${err}`,
        404
      )
    );
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "The fields are empty.",
    });
  }

  try {
    let userRef = await userCollectionRef.where("email", "==", email).get();

    if (userRef.size > 0) {
      return next(new ErrorHandler("User already exists", 400));
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User(name, email, hashedPassword);
      userRef = await userCollectionRef.add({ ...newUser });
      sendCookie(userRef, res, "Registered Successfully.", 201);
    }
  } catch (err) {
    new ErrorHandler(
      `Some error occured while registering in the user: ${err}`,
      404
    );
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
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({ success: true, user: req.user });
};
