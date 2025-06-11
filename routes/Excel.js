import { Router } from "express";
import { uploadExcelFile, ExcelAllData, deleteExcelFile , getUserStats} from "../controllers/ExcelController.js";
import { uploadExcelFile, ExcelAllData, deleteExcelFile, userFileName, fetchData } from "../controllers/ExcelController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";



const ExcelRouter = Router();

// ExcelRouter.post('/uploadExcelFile', upload.single("File"), verifyToken, uploadExcelFile)
ExcelRouter.post('/uploadExcelFile', verifyToken, upload.single("File"), uploadExcelFile);
// ExcelRouter.post('/ColoumnVisulize', verifyToken, ColoumnVisulize)
ExcelRouter.post('/fetchData',verifyToken,fetchData)

ExcelRouter.get('/ExcelAllData', verifyToken, ExcelAllData);
ExcelRouter.get('/userFileName',verifyToken,userFileName);
ExcelRouter.delete("/delete/:id", verifyToken, deleteExcelFile);
ExcelRouter.get("/userStats", verifyToken, getUserStats);

export default ExcelRouter; 