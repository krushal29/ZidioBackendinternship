import { v2 as cloudinary } from 'cloudinary'
import xlsx from 'xlsx'
import fs from 'fs';
import axios from 'axios'
import userDetails from '../models/UserModel.js';
import ExcelDetails from '../models/ExcelDataModel.js';
import Report from '../models/ReportModel.js';
// import OverViewOFFile from './AIController.js';
import OverViewOFFile from './aiGemini.js';

const analyzeData = async (url) => {
  try {
    console.log("Fetching Excel from URL:", url);
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
    console.error('Excel parsing failed:', e.message);
    throw new Error('Excel parsing failed');
  }
};


const analyze3DData = async (req, res) => {
  try {
    const { url, xAxis, yAxis, zAxis } = req.body;

    if (!url || !xAxis || !yAxis || !zAxis) {
      return res.status(400).json({ success: false, message: "Missing required fields (url, xAxis, yAxis, zAxis)." });
    }

    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const workbook = xlsx.read(response.data, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Verify xAxis, yAxis, zAxis exist in the sheet columns
    const firstRow = data[0] || {};
    const availableColumns = Object.keys(firstRow);

    const missingColumns = [xAxis, yAxis, zAxis].filter(col => !availableColumns.includes(col));
    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Columns ${missingColumns.join(", ")} not found. Available columns: ${availableColumns.join(", ")}`
      });
    }

    const processedData = data.map(row => ({
      x: row[xAxis],
      y: row[yAxis],
      z: row[zAxis]
    }));

    return res.status(200).json({
      success: true,
      message: "3D data extracted successfully.",
      processedData
    });

  } catch (e) {
    console.error("Error analyzing 3D data:", e);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: e.message
    });
  }
};



const analyzeDataFromPath = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const result = {};

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
      result[sheetName] = jsonData;
    });

    return result;
  } catch (e) {
    console.error("Local Excel parsing failed:", e.message);
    throw new Error("Failed to parse local Excel file");
  }
};



const ColoumnVisulize = async (url, xAxis, yAxis) => {
  try {
   // const { url, xAxis, yAxis } = req.body;
    if (!url || !xAxis || !yAxis) {
      return res.status(400).json({ success: false, message: "Missing input fields." });
    }
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    // Load file from server
    const workbook = xlsx.read(response.data, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Prepare chart data
    const chartData = data.filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined).map((row) => ({
      x: row[xAxis],
      y: row[yAxis]
    }))
    return { headers: Object.keys(data[0]), chartData }

  } catch (e) {
    return e.message
  }
}


const uploadExcelFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found in request." });
    }

    const UserEmail = req.user.id;
    const user = await userDetails.findById(UserEmail);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const Files = req.file?.path;
    if (!Files) {
      return res.status(400).json({ data: false, message: "Please upload a file!" });
    }

  
    const data = analyzeDataFromPath(Files);

    const firstRow = data.Sheet1?.[0];

    if (!firstRow) {
      fs.unlinkSync(Files);
      return res.status(400).json({ data: false, message: "No rows in Excel file." });
    }

    const xAxis = [];
    const yAxis = [];

    for (const key in firstRow) {
      if (typeof firstRow[key] === "string") xAxis.push(key);
      if (typeof firstRow[key] === "number") yAxis.push(key);
    }

   
    const uploadFile = await cloudinary.uploader.upload(Files, {
      resource_type: "raw",
    });

    const ProfileFile = uploadFile.secure_url;
    fs.unlinkSync(Files); // cleanup

    const OverView = await OverViewOFFile(data);
    if (!OverView?.data) {
      return res.status(400).json({ data: false, message: "Failed to generate AI overview" });
    }

    const ExcelData = {
      user_id: user._id,
      FileURl: ProfileFile,
      FileName: req.file.originalname,
      FileSize: uploadFile.bytes,
      asset_id: uploadFile.asset_id,
      ExcelData: data,
      xAxis,
      yAxis
    };

    await ExcelDetails.create(ExcelData);

    await Report.create({
      title: req.file.originalname,
      description: `Uploaded by ${user.Name || user.email}`,
      isReviewed: false
    });

    return res.json({
      success: true,
      ProfileFile,
      asset_id: uploadFile.asset_id,
      display_name: req.file.originalname,
      OverView: OverView.text,
      xAxis,
      yAxis
    });

  } catch (e) {
    console.error("Upload Error:", e);
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

    // const user = await userDetails.findOne({ email: userEmail });
    // const user = await userDetails.findOne({ email: userEmail });
    const user = await userDetails.findById(userEmail);

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

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await ExcelDetails.find({ user_id: userId });

    const totalFiles = files.length;
    const totalSize = files.reduce((acc, file) => acc + file.FileSize, 0); 

  
    const aiInsights = files.filter(file =>
      file.ExcelData && Object.keys(file.ExcelData).length > 0
    ).length;


    return res.status(200).json({
      success: true,
      totalFiles,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      aiInsights
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user stats",
      error: error.message
    });
  }
};


const userFileName = async (req, res) => {
  try {
    const userEmail = req.user.id;
    // const userEmail = req.user.email;

    if (!userEmail) {
      return res.status(401).json({ data: false, message: "Unauthorized: User email not found in request." });
    }

    // const user = await userDetails.findOne({ email: userEmail });
    // const user = await userDetails.findOne({ email: userEmail });
    const user = await userDetails.findById(userEmail);

    const ExcelData = await ExcelDetails.find({ user_id: user._id }).sort({ updatedAt: -1 })
    let FileName = {}

    FileName = ExcelData.map((data, index) => ({
      "FileName": data.FileName, "_id": data._id, xAxis: data.xAxis, yAxis: data.yAxis
    }))

    res.json({ data: true, FileName })

  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
}

const fetchData = async (req, res) => {
  try {
    const { url, yAxis, xAxis } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: "Missing file URL." });
    }

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const workbook = xlsx.read(response.data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: null });

    if (xAxis && yAxis) {
      // 2-axis chart (bar, line, scatter, etc.)
      const chartData = data
        .filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined)
        .map(row => ({ x: row[xAxis], y: row[yAxis] }));
      return res.status(200).json({ data: true, chartData, headers: Object.keys(data[0]) });
    }

    if (xAxis && !yAxis) {
      // Pie/Donut chart: one axis only
      const counts = {};
      data.forEach(row => {
        const value = row[xAxis];
        if (value !== null && value !== undefined) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);
      const total = values.reduce((acc, val) => acc + val, 0);

      const chartData = labels.map(label => ({
        x: label,
        y: counts[label],
        percentage: ((counts[label] / total) * 100).toFixed(2)
      }));

      return res.status(200).json({ data: true, chartData });
    }

    const firstRow = data[0];
    const xAxisOptions = [], yAxisOptions = [];

    for (const key in firstRow) {
      if (typeof firstRow[key] === 'string') xAxisOptions.push(key);
      if (typeof firstRow[key] === 'number') yAxisOptions.push(key);
    }

    return res.status(200).json({ data: true, xAxis: xAxisOptions, yAxis: yAxisOptions });

  } catch (e) {
    console.error("FetchData error:", e.message);
    return res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
}






export { uploadExcelFile, ExcelAllData, deleteExcelFile, ColoumnVisulize, userFileName, fetchData , getUserStats, analyze3DData}
