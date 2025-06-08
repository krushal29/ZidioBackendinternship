import Report from '../models/ReportModel.js';
import Session from '../models/SessionModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const reviewedCount = await Report.countDocuments({ isReviewed: true });
    const activeSessionCount = await Session.countDocuments({ isActive: true });

    console.log("Reviewed Reports:", reviewedCount);
    console.log("Active Sessions:", activeSessionCount);

    res.status(200).json({
      reviewedReports: reviewedCount,
      activeSessions: activeSessionCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
