import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userDetails',
    required: true,
  },
  isActive: { type: Boolean, default: false },
  lastLogin: { type: Date },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
