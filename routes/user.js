import express from "express";
import { getMyProfile, login, logout, register } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

//USER API routes
// router.get("/all", getAllUsers);
router.post("/new", register);
router.post("/login", login);
router.get("/logout", logout);
// router.get("/me", isAuthenticated, getMyProfile);

router.route("/me").get(isAuthenticated, getMyProfile);
// .put(updateUser)
// .delete(deleteUser);

export default router;
