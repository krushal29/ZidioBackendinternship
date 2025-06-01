import { v2 as cloudinary } from 'cloudinary'
import xlsx from 'xlsx'
import fs from 'fs';
import axios from 'axios'




const analyzeData = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        const workbook = xlsx.read(response.data, { type: 'buffer' });

        const result = {};

        workbook.SheetNames.forEach(sheetName => {
            console.log("SheetName",sheetName);
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
            result[sheetName] = jsonData;
        });

        console.log(result);

        return result

    } catch (e) {
        console.error('Error fetching or parsing Excel file:', error.message);
    }
}


const uploadExcelFile = async (req, res) => {
    try {
        const Files = req.file.path;
        if (!Files) {
            return res.status(400).json({ data: false, message: "Please upload an image!" });
        }
        const uploadFile = await cloudinary.uploader.upload(Files, {
            resource_type: "raw"
        })
        const ProfileFile = uploadFile.secure_url;
        fs.unlinkSync(req.file.path);
          const data= await analyzeData(ProfileFile)
        res.json({ success: true, ProfileFile, asset_id: uploadFile.asset_id, orignalFileName: uploadFile.original_filename });

    } catch (e) {
        res.status(500).json({ data: false, message: "Server Error.Please try again!!!", error: e })
    }
}




export default uploadExcelFile