// ReportModel.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  isReviewed: { type: Boolean, default: false },
  fileSize: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
