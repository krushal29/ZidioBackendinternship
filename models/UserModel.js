import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique: true, 
    },
    email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"user"
    },
    isLogin:{
        type:Boolean,
        default:false
    },
    lastLogin: {
  type: Date,
  default: null
}
},{collection:"UserDetails"})


const userDetails=mongoose.model("user",userSchema);

export default userDetails;