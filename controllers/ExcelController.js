import { v2 as cloudinary } from 'cloudinary'
import xlsx from 'xlsx'
import fs from 'fs';
import axios from 'axios'
import userDetails from '../models/UserModel.js';
import ExcelDetails from '../models/ExcelDataModel.js';




const analyzeData = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        const workbook = xlsx.read(response.data, { type: 'buffer' });

        const result = {};

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
            result[sheetName] = jsonData;
        });

        return result

    } catch (e) {
        console.error('Error fetching or parsing Excel file:', error.message);
    }
}


const uploadExcelFile = async (req, res) => {
    try {
        const UserEmail=req.user.id;


        const user=await userDetails.findOne({email:UserEmail});
        const userId=user._id;


        const Files = req.file.path;

        if (!Files) {
            return res.status(400).json({ data: false, message: "Please upload an image!" });
        }


        const uploadFile = await cloudinary.uploader.upload(Files, {
            resource_type: "raw"
        })


        const ProfileFile = uploadFile.secure_url;
        fs.unlinkSync(req.file.path);


        const data = await analyzeData(ProfileFile)
        const ExcelData={
            user_id:userId,
            FileURl:ProfileFile,
            FileName:uploadFile.display_name,
            FileSize:uploadFile.bytes,
            asset_id:uploadFile.asset_id,
            ExcelData:data
        }

        const response=await ExcelDetails.insertOne(ExcelData);
        
        if(response){
           return res.json({ success: true, ProfileFile, asset_id: uploadFile.asset_id, display_name: uploadFile.display_name });
        }


    } catch (e) {
       return res.status(500).json({ data: false, message: "Server Error.Please try again!!!", error: e })
    }
}


const ExcelAllData=async(req,res)=>{
    try{
        const UserEmail=req.user.id;

        if (!UserEmail) {
            return res.status(401).json({ data: false, message: "Unauthorized: User ID not found in request." });
        }

        const user=await userDetails.findOne({email:UserEmail});
        const userId=user._id;

        if(!user){
            return res.status(404).json({data:false,message:"User not found!!!"})
        }

        const ExcelData=await ExcelDetails.find({user_id:userId})

        return res.status(200).json({data:true,message:ExcelData})

    }catch(e){
        return res.status(500).json({data:false,message:"Server Error.Please try again!!!"})
    }
}




export {uploadExcelFile,ExcelAllData}