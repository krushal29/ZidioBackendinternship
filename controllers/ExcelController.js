import { v2 as cloudinary } from 'cloudinary'
import xlsx from 'xlsx'
import fs from 'fs';
import axios from 'axios'
import userDetails from '../models/UserModel.js';
import ExcelDetails from '../models/ExcelDataModel.js';


const analyzeData = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const workbook = xlsx.read(response.data, { type: 'buffer' });

        const result = {};
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
            result[sheetName] = jsonData;
        });

        return result;
    } catch (e) {
        console.error('Error fetching or parsing Excel file:', e.message);
        throw new Error('Excel parsing failed');
    }
};


const uploadExcelFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found in request." });
    }

    const UserEmail = req.user.id;
    const user = await userDetails.findOne({ email: UserEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userId = user._id;
    const Files = req.file?.path;

    if (!Files) {
      return res.status(400).json({ data: false, message: "Please upload a file!" });
    }

    const uploadFile = await cloudinary.uploader.upload(Files, {
      resource_type: "raw"
    });

    const ProfileFile = uploadFile.secure_url;
    fs.unlinkSync(Files); 

    const data = await analyzeData(ProfileFile);

    const ExcelData = {
      user_id: userId,
      FileURl: ProfileFile,
      FileName: req.file.originalname,
      FileSize: uploadFile.bytes,
      asset_id: uploadFile.asset_id,
      ExcelData: data
    };

    const response = await ExcelDetails.create(ExcelData);

    return res.json({
      success: true,
      ProfileFile,
      asset_id: uploadFile.asset_id,
      display_name: req.file.originalname
    });

  } catch (e) {
    console.error('Upload Error:', e);
    return res.status(500).json({
      data: false,
      message: "Server Error. Please try again!",
      error: e.message
    });
  }
};


const ExcelAllData = async (req, res) => {
  try {
    const userEmail = req.user.id; 
    // const userEmail = req.user.email;

    if (!userEmail) {
      return res.status(401).json({ data: false, message: "Unauthorized: User email not found in request." });
    }

    const user = await userDetails.findOne({ email: userEmail });
    // const user = await userDetails.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ data: false, message: "User not found!" });
    }

    const ExcelData = await ExcelDetails.find({ user_id: user._id });

    return res.status(200).json({ data: true, message: ExcelData });
  } catch (e) {
    console.error("ExcelAllData Error:", e);
    return res.status(500).json({ data: false, message: "Server Error. Please try again!", error: e.message });
  }
};




const deleteExcelFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    const deleted = await ExcelDetails.findByIdAndDelete(fileId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    return res.json({ success: true, message: "File deleted" });
  } catch (e) {
    console.error("Delete error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





export {uploadExcelFile,ExcelAllData, deleteExcelFile}