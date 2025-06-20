import { Router } from 'express';
import { adminSignup, adminLogin, adminLogout, getAllReports, reviewReport, filterFile, getReportsByUser, getReportsByUserName } from '../controllers/adminController.js';
import { getAllUsers, updateUser, deleteUser } from '../controllers/adminUserController.js';
import { getDashboardStats } from '../controllers/adminStatsController.js';
import verifyToken from '../middleware/verifyToken.js';

const adminRoute = Router();

adminRoute.post('/admin-signup', adminSignup);
adminRoute.post('/admin-login', adminLogin);
adminRoute.post('/logout', verifyToken, adminLogout);
adminRoute.post('/filterFile',verifyToken,filterFile);



adminRoute.get('/users', verifyToken, getAllUsers);
adminRoute.put('/users/:id', verifyToken, updateUser);
adminRoute.delete('/users/:id', verifyToken, deleteUser);

adminRoute.get('/dashboard-stats', verifyToken, getDashboardStats);

adminRoute.get('/reports', getAllReports);
adminRoute.put('/reports/:id/review', reviewReport);

adminRoute.get('/reports/user/:userId',verifyToken, getReportsByUser);
adminRoute.get('/reports/by-username/:username', getReportsByUserName);


export default adminRoute;
