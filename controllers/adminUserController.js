import userDetails from '../models/UserModel.js';

// Get all users
export const getAllUsers = async (req, res) => {

    console.log("Fetching users...");
  try {
    
    const users = await userDetails.find();
    console.log("Users found:", users.length);
    res.status(200).json({ data: true, users });
  } catch (error) {
    res.status(500).json({ data: false, message: 'Error fetching users', error });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await userDetails.findByIdAndUpdate(id, updates);
    res.status(200).json({ data: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ data: false, message: 'Error updating user', error });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userDetails.findByIdAndDelete(id);
    res.status(200).json({ data: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ data: false, message: 'Error deleting user', error });
  }
};
