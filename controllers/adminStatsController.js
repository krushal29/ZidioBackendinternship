import Report from '../models/ReportModel.js';
import Session from '../models/SessionModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalFilesUploaded = await Report.countDocuments(); 
    const activeSessionCount = await Session.countDocuments({ isActive: true });

    res.status(200).json({
      totalFiles: totalFilesUploaded,
      activeSessions: activeSessionCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
