import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const router = express.Router();

// Register and login routes (no auth needed)
router.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
router.post("/login", loginValidator(), validateHandler, login);

// Auth middleware for all routes below
router.use(isAuthenticated);

// Protected routes
router.get("/me", getMyProfile);
router.get("/logout", logout);
router.get("/search", searchUser);

router.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest);
router.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest);

router.get("/notifications", getMyNotifications);
router.get("/friends", getMyFriends);

export default router;
