import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';


const uploadExcelFile = async (req, res) => {
    try {
        const Files=req.file.path;
        if(!Files){
            return res.status(400).json({ data: false, message: "Please upload an image!" });
        }
        const uploadFile=await cloudinary.uploader.upload(Files,{
            resource_type:"raw"
        })
        const ProfileFile=uploadFile.secure_url;
        fs.unlinkSync(req.file.path);
        res.json({ success: true,ProfileFile,asset_id:uploadFile.asset_id });
    } catch (e) {
        res.status(500).json({ data: false, message: "Server Error.Please try again!!!", error: e.message })
    }
}


export default uploadExcelFile