import { Router } from "express";
import { uploadExcelFile, ExcelAllData, deleteExcelFile , getUserStats, getSingleExcelFile} from "../controllers/ExcelController.js";
import { userFileName, fetchData, ColoumnVisulize } from "../controllers/ExcelController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";
// import OverViewOFFile from "../controllers/AIController.js";
import OverViewOFFile from "../controllers/aiGemini.js";
import getFileOverview from "../controllers/AIController.js"



const ExcelRouter = Router();

// ExcelRouter.post('/uploadExcelFile', upload.single("File"), verifyToken, uploadExcelFile)
ExcelRouter.post('/uploadExcelFile', verifyToken, upload.single("File"), uploadExcelFile);
ExcelRouter.post('/ColoumnVisulize', verifyToken, ColoumnVisulize)
ExcelRouter.post('/fetchData',verifyToken,fetchData)

ExcelRouter.get('/ExcelAllData', verifyToken, ExcelAllData);
ExcelRouter.get('/userFileName',verifyToken,userFileName);
ExcelRouter.delete("/delete/:id", verifyToken, deleteExcelFile);
ExcelRouter.get("/userStats", verifyToken, getUserStats);

ExcelRouter.get("/overview/:fileId", verifyToken, getFileOverview);
ExcelRouter.get("/get/:fileId", verifyToken, getSingleExcelFile);

export default ExcelRouter; 