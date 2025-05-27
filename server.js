import express from 'express'
import connectDB from './Config/mongo.js';
import dotenv from 'dotenv'
import cors from 'cors'
import userRoute from './routes/User.js';


const port=80
const app=express();



app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
dotenv.config();


//Database connect
connectDB();



// For API
app.use('/api/user',userRoute);



app.listen(port,()=>{
    console.log("server is running "+port); 
})
