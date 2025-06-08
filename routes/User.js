import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { forgotPassword, login, logout, signup } from "../controllers/userController.js";

import passport from 'passport';
import jwt from 'jsonwebtoken'


const userRoute=Router();
const adminRoute = Router();

userRoute.post('/signup',signup);
userRoute.post('/login',login);
userRoute.post('/forgotPassword',forgotPassword);
userRoute.post('/logout',verifyToken,logout);

userRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRoute.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  // const token = jwt.sign({ id: req.user.email }, process.env.JWT_TOKEN_KEY);
  // const token = jwt.sign({ id: req.user._id }, process.env.JWT_TOKEN_KEY);
  const token = jwt.sign(
  {
    id: req.user._id,
    email: req.user.email,
    name: req.user.Name
  },
  process.env.JWT_TOKEN_KEY
);

  res.redirect(`http://localhost:5173/oauth-success?token=${token}&name=${req.user.Name}&email=${req.user.email}`);
});

userRoute.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
userRoute.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  // const token = jwt.sign({ id: req.user.email }, process.env.JWT_TOKEN_KEY);
  // const token = jwt.sign({ id: req.user._id }, process.env.JWT_TOKEN_KEY);
  const token = jwt.sign(
  {
    id: req.user._id,
    email: req.user.email,
    name: req.user.Name
  },
  process.env.JWT_TOKEN_KEY
);

  res.redirect(`http://localhost:5173/oauth-success?token=${token}&name=${req.user.Name}&email=${req.user.email}`);
});

export default userRoute;