import admin from "../databaseConnection/firebaseConfig.js";
const db = admin.firestore();
const userCollectionRef = db.collection("Users");
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded._id;
    const userSnapshot = await userCollectionRef.doc(id).get();
    req.user = { id, ...userSnapshot.data() };
    next();
  } catch (err) {
    res.status(404).json({
      success: false,
      error: err,
    });
  }
};
