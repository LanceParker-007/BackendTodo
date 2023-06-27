import express from "express";
import {
  getAllUsers,
  getMyProfile,
  login,
  register,
} from "../controllers/user.js";
const router = express.Router();

//USER API routes
router.get("/all", getAllUsers);
router.post("/new", register);
router.post("/login", login);

router.route("/me").get(getMyProfile);
// .put(updateUser)
// .delete(deleteUser);

export default router;
