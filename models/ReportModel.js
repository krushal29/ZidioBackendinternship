import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  isReviewed: { type: Boolean, default: false },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
