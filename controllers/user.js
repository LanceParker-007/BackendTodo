import admin from "../databaseConnection/firebaseConfig.js";
const db = admin.firestore();
const userCollectionRef = db.collection("Users");
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import User from "../models/user.js";

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
      console.log(password); //recieved password from frontend
      console.log(userRef.docs[0].data().password); //recieved password from Records
      const isMatch = await bcrypt.compare(
        password,
        userRef.docs[0].data().password
      );
      if (isMatch) {
        const user = userRef.docs[0].data();
        sendCookie(userRef, res, `Welcome back ${user.name}`, 201);
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
    return res.json({
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
    return res.json({
      success: false,
      message: "Some error occured while registering the user.",
      Error: err,
    });
  }
};

export const getMyProfile = async (req, res) => {
  const id = "hwfYrGAiYinCChf1dy2l";

  const user = await userCollectionRef.doc(id).get();
  //   console.log(user);
  return res.status(200).json({ success: true, user });
};
