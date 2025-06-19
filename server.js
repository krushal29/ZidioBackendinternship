import express from 'express'
import connectDB from './Config/mongo.js';
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import userRoute from './routes/User.js';
import adminRoute from './routes/Admin.js';
import ExcelRouter from './routes/Excel.js';
import connectCloudinary from './Config/cloudinary.js';
import session from 'express-session';
import passport from 'passport';
import './Config/passport.js';
import GraphRoute from './routes/Graph.js';



const port=80
const app=express();


app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


//Database connect
connectDB();
connectCloudinary();


// For API
app.use('/api/user',userRoute);
app.use('/api/excel',ExcelRouter);
app.use('/api/admin', adminRoute);
app.use('/api/graph',GraphRoute);




app.listen(port,()=>{
    console.log("server is running "+port); 
})
