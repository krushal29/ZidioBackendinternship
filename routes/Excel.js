import { Router } from "express";
import uploadExcelFile from "../controllers/ExcelController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";



const ExcelRouter=Router();

ExcelRouter.post('/uploadExcelFile',upload.single("File"),verifyToken,uploadExcelFile)


export default ExcelRouter;