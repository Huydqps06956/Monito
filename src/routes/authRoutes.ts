import express from "express";
import { check } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
  googleLogin,
} from "../controllers/authController";
import { protect } from "../middlewares/auth";
import passport from "../config/passport";

const router = express.Router();

// Register route with validation
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  register
);

// Login route with validation
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin
);

// Protected routes
router.get("/me", protect, getMe);
router.get("/logout", logout);

export default router;
