import admin from "../databaseConnection/firebaseConfig.js";
const db = admin.firestore();
const userCollectionRef = db.collection("Users");
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import User from "../models/user.js";
// import jwt from "jsonwebtoken";

//All functions
export const getAllUsers = async (req, res) => {};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "The fields are empty.",
    });
  }

  let userRef = await userCollectionRef.where("email", "==", email).get();

  try {
    if (userRef.empty) {
      console.log("Invalid email.");
      return res.status(404).json({
        success: false,
        message: "Invalid email.",
      });
    } else {
      //   console.log(password); //recieved password from frontend
      //   console.log(userRef.docs[0].data().password); //recieved password from Records
      const user = userRef.docs[0];
      const isMatch = await bcrypt.compare(password, user.data().password);
      if (isMatch) {
        sendCookie(user, res, `Welcome back ${user.data().name}`, 201);
      } else {
        console.log("Invalid password");
        return res.status(404).json({
          success: false,
          message: "Invalid password",
        });
      }
    }
  } catch (err) {
    console.log("Some error occured while logging in the user.", err);
    return res.status(404).json({
      success: false,
      message: "Some error occured while loggin in the user.",
      Error: err,
    });
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
      console.log("User already regitered!");
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User(name, email, hashedPassword);
      userRef = await userCollectionRef.add({ ...newUser });
      sendCookie(userRef, res, "Registered Successfully.", 201);
    }
  } catch (err) {
    console.log("Some error occured while registering the user.", err);
    return res.status(404).json({
      success: false,
      message: "Some error occured while registering the user.",
      Error: err,
    });
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
