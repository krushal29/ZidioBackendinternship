import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary=async()=>{
    cloudinary.config({
        cloud_name:process.env.Cloude_Name,
        api_key:process.env.Cloude_API_Key,
        api_secret:process.env.Cloude_API_Secret
    })
}

export default connectCloudinary;