import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminDetails from '../models/AdminModel.js';
import Report from '../models/ReportModel.js';

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      name: admin.Name,
      role: admin.role
    },
    process.env.JWT_TOKEN_KEY
  );
};

const adminSignup = async (req, res) => {
    console.log("Incoming data:", req.body);
  try {
    const { AdminName, AdminEmail, Password } = req.body;

    if (!AdminName || !AdminEmail || !Password) {
      return res.status(400).json({ data: false, message: "All fields are required" });
    }

    const existingAdmin = await adminDetails.findOne({ email: AdminEmail });
    if (existingAdmin) {
      return res.status(400).json({ data: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 13);
    const admin = await adminDetails.create({
      Name: AdminName,
      email: AdminEmail,
      Password: hashedPassword
    });

    const token = createToken(admin);

    await adminDetails.updateOne({ email: AdminEmail }, { isLogin: true });

    return res.status(200).json({
      data: true,
      message: "Admin signup successful!",
      token,
      admin: {
        name: admin.Name,
        email: admin.email
      }
    });
  } catch (error) {
    return res.status(500).json({ data: false, message: "Server error", error });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ data: false, message: "All fields are required" });
    }

    const admin = await adminDetails.findOne({ email: Email });
    if (!admin) {
      return res.status(404).json({ data: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(Password, admin.Password);
    if (!isMatch) {
      return res.status(401).json({ data: false, message: "Incorrect password" });
    }

    const token = createToken(admin);

    await adminDetails.updateOne({ email: Email }, { isLogin: true });

    return res.status(200).json({
      data: true,
      message: "Admin login successful",
      token,
      admin: {
        name: admin.Name,
        email: admin.email
      }
    });
  } catch (error) {
    return res.status(500).json({ data: false, message: "Server error", error });
  }
};

const adminLogout = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

    await adminDetails.updateOne({ email: decoded.email }, { isLogin: false });

    return res.status(200).json({ data: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ data: false, message: "Server error", error });
  }
};


const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

const reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Report.findByIdAndUpdate(id, { isReviewed: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json({ message: 'Report reviewed successfully', report: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to review report' });
  }
};


export { adminSignup, adminLogin, adminLogout, getAllReports, reviewReport };
