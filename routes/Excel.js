import { Router } from "express";
import { uploadExcelFile, ExcelAllData } from "../controllers/ExcelController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";



const ExcelRouter = Router();

ExcelRouter.post('/uploadExcelFile', upload.single("File"), verifyToken, uploadExcelFile)
ExcelRouter.get('/ExcelAllData', verifyToken, ExcelAllData)


export default ExcelRouter;