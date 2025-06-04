import express from 'express'
import connectDB from './Config/mongo.js';
import dotenv from 'dotenv'
import cors from 'cors'
import userRoute from './routes/User.js';
import ExcelRouter from './routes/Excel.js';
import connectCloudinary from './Config/cloudinary.js';


const port=80
const app=express();


app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
dotenv.config();


//Database connect
connectDB();
connectCloudinary();



// For API
app.use('/api/user',userRoute);
app.use('/api/excel',ExcelRouter);



app.listen(port,()=>{
    console.log("server is running "+port); 
})
