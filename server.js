// import express from 'express'
// import connectDB from './Config/mongo.js';
// import dotenv from 'dotenv'
// dotenv.config();
// import cors from 'cors'
// import userRoute from './routes/User.js';
// import adminRoute from './routes/Admin.js';
// import ExcelRouter from './routes/Excel.js';
// import connectCloudinary from './Config/cloudinary.js';
// import session from 'express-session';
// import passport from 'passport';
// import './Config/passport.js';
// import GraphRoute from './routes/Graph.js';



// // const port=80
// const port=process.env.BACKEND_URl
// const app=express();


// app.use(express.json({limit:'50mb'}));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors());


// app.use(session({
//   secret: 'someSecretKey',
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());


// //Database connect
// connectDB();
// connectCloudinary();


// // For API
// app.use('/api/user',userRoute);
// app.use('/api/excel',ExcelRouter);
// app.use('/api/admin', adminRoute);
// app.use('/api/graph',GraphRoute);




// app.listen(port,()=>{
//     console.log("server is running "+port); 
// })



import express from 'express';
import connectDB from './Config/mongo.js';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import userRoute from './routes/User.js';
import adminRoute from './routes/Admin.js';
import ExcelRouter from './routes/Excel.js';
import connectCloudinary from './Config/cloudinary.js';
import session from 'express-session';
import passport from 'passport';
import './Config/passport.js';
import GraphRoute from './routes/Graph.js';

// Port config
const port = process.env.PORT || 4000;
const app = express();

// CORS configuration
const allowedOrigins = [
  'https://excelflow.netlify.app',  // Your frontend production URL
  'http://localhost:5173'            // Your local frontend URL (Vite dev server)
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // Allow cookies, authorization headers, TLS client certificates
}));

// To handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session setup
app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: true,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Database and Cloudinary connection
connectDB();
connectCloudinary();

// API routes
app.use('/api/user', userRoute);
app.use('/api/excel', ExcelRouter);
app.use('/api/admin', adminRoute);
app.use('/api/graph', GraphRoute);

// Start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
