// import mongoose from "mongoose";

// const connectDB=async ()=>{
//     mongoose.connection.on('connect',()=>{
//         console.log("DB connected");
//     })
//     await mongoose.connect(`${process.env.MONGO_URL}`);
// }

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
export default connectDB;