import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    isLogin: {
        type: Boolean,
        default: false
    }
}, { collection: "AdminDetails" });

const adminDetails = mongoose.model("admin", adminSchema);

export default adminDetails;
