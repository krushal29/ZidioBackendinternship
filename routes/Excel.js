import { Router } from "express";
import { uploadExcelFile, ExcelAllData, deleteExcelFile, ColoumnVisulize } from "../controllers/ExcelController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";



const ExcelRouter = Router();

// ExcelRouter.post('/uploadExcelFile', upload.single("File"), verifyToken, uploadExcelFile)
ExcelRouter.post('/uploadExcelFile', verifyToken, upload.single("File"), uploadExcelFile);
ExcelRouter.post('/ColoumnVisulize', verifyToken, ColoumnVisulize);

ExcelRouter.get('/ExcelAllData', verifyToken, ExcelAllData);
ExcelRouter.delete("/delete/:id", verifyToken, deleteExcelFile);

export default ExcelRouter;