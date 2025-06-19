// ReportModel.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  isReviewed: { type: Boolean, default: false },
  fileSize: Number, // <-- Add this field
}, {
  timestamps: true, // ensures createdAt is available
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
