import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { forgotPassword, login, logout, signup } from "../controllers/userController.js";


const userRoute=Router();

userRoute.post('/signup',signup);
userRoute.post('/login',login);
userRoute.post('/forgotPassword',forgotPassword);

userRoute.get('/logout',verifyToken,logout);

export default userRoute;