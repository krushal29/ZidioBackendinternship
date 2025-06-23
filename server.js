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



// const port=80
const port = process.env.PORT || 4000;
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


// import express from 'express';
// import connectDB from './Config/mongo.js';
// import dotenv from 'dotenv';
// dotenv.config();
// import cors from 'cors';
// import userRoute from './routes/User.js';
// import adminRoute from './routes/Admin.js';
// import ExcelRouter from './routes/Excel.js';
// import connectCloudinary from './Config/cloudinary.js';
// import session from 'express-session';
// import passport from 'passport';
// import './Config/passport.js';
// import GraphRoute from './routes/Graph.js';

// const app = express();
// const port = process.env.PORT || 4000;


// const allowedOrigins = [
//   'https://excelflow.netlify.app',  // production frontend
//   'http://localhost:5173'           // local dev frontend
// ];


// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); 
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error(`CORS error: ${origin} is not allowed.`));
//     }
//   },
//   credentials: true
// }));


// app.options('*', cors());


// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));


// app.use(session({
//   secret: 'someSecretKey',
//   resave: false,
//   saveUninitialized: true
// }));


// app.use(passport.initialize());
// app.use(passport.session());


// connectDB();
// connectCloudinary();


// app.use('/api/user', userRoute);
// app.use('/api/admin', adminRoute);
// app.use('/api/excel', ExcelRouter);
// app.use('/api/graph', GraphRoute);


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

