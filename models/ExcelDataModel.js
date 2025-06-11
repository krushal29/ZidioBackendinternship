import mongoose from "mongoose";

const ExcelDataSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    FileURl: {
        type: String,
        required: true
    },
    FileName: {
        type: String,
        required: true
    },
    FileSize: {
        type: Number,
        required: true
    },
    asset_id: {
        type: String,
    },
    ExcelData: {
        type: Object,
        default: {},
    },
    xAxis:{
        type:Array,
        default:[]
    },
    yAxis:{
        type:Array,
        default:[]
    },
    AIOverView:{
        type:String,
        default:''
    }


}, { collection: "ExcelDetails", timestamps: true })


const ExcelDetails = mongoose.model("Excel", ExcelDataSchema);

export default ExcelDetails;