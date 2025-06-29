import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userDetails from '../models/UserModel.js';
import Session from '../models/SessionModel.js'; 

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_TOKEN_KEY);
// }

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.Name
    },
    process.env.JWT_TOKEN_KEY
  );
};


const signup = async (req, res) => {
    try {
        const { UserName, UserEmail, Password } = req.body;
        if (!UserName || !UserEmail || !Password) {
            return res.status(400).json({ data: false, message: "Please fill the details" });
        }

        const existingUser = await userDetails.findOne({ email: UserEmail });
        if (existingUser) {
            return res.status(400).json({ data: false, message: "User already exists. Please try again!" });
        }

        const existingName = await userDetails.findOne({ Name: UserName });
if (existingName) {
  return res.status(400).json({ data: false, message: "Name already taken. Please choose a different name." });
}


        const hashedPassword = await bcrypt.hash(Password, 13);

        const userData = {
            Name: UserName,
            email: UserEmail,
            Password: hashedPassword,
        };

        const user = await userDetails.create(userData);
        // const token = createToken(user.email);
        const token = createToken(user);


        if (!user) {
            return res.status(500).json({ data: false, message: "Failed to create user. Please try again later." });
        } else {
            await userDetails.updateOne({ email: UserEmail }, { isLogin: true });

            // Return token, role, and user (name + email)
            return res.status(200).json({
                data: true,
                message: "Signup successful!",
                token,
                role: user.role,
                user: {
                    name: user.Name,
                    email: user.email,
                },
            });
        }
    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error!", error: e });
    }
};



// const login = async (req, res) => {
//   try {
//     const { Email, Password } = req.body;
//     if (!Email || !Password)
//       return res.status(400).json({ data: false, message: "Please Fill all the Fields" });

//     const user = await userDetails.findOne({ email: Email });
//     if (!user)
//       return res.status(404).json({ data: false, message: "User not found" });

//     const ComparePassword = await bcrypt.compare(Password, user.Password);
//     if (!ComparePassword)
//       return res.status(401).json({ data: false, message: "Invalid password" });

//     const token = createToken(user); 

//     const updatedUser = await userDetails.findOneAndUpdate(
//       { email: Email },
//       { isLogin: true, lastLogin: new Date() },
//       { new: true }
//     );

//     await Session.findOneAndUpdate(
//       { userId: user._id },
//       { isActive: true, lastLogin: new Date() },
//       { upsert: true, new: true }
//     );

//     return res.status(200).json({
//       data: true,
//       message: "login Successful",
//       token,
//       role: updatedUser.role,
//       user: {
//         name: updatedUser.Name,
//         email: updatedUser.email,
//         lastLogin: updatedUser.lastLogin,
//       },
//     });
//   } catch (e) {
//     return res.status(500).json({
//       data: false,
//       message: "Server Error. Please try again",
//       error: e.message,
//     });
//   }
// };


const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password)
      return res.status(400).json({ data: false, message: "Please Fill all the Fields" });

    const user = await userDetails.findOne({ email: Email });
    if (!user)
      return res.status(404).json({ data: false, message: "User not found" });

    const ComparePassword = await bcrypt.compare(Password, user.Password);
    if (!ComparePassword)
      return res.status(401).json({ data: false, message: "Invalid password" });

    const token = createToken(user);

    // ✅ Store previous lastLogin before update
    const previousLogin = user.lastLogin;

    // ✅ Update login status and current login time
    await userDetails.findOneAndUpdate(
      { email: Email },
      { isLogin: true, lastLogin: new Date() },
      { new: true }
    );

    await Session.findOneAndUpdate(
      { userId: user._id },
      { isActive: true, lastLogin: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      data: true,
      message: "login Successful",
      token,
      role: user.role,
      user: {
        name: user.Name,
        email: user.email,
        lastLogin: previousLogin, 
      },
    });
  } catch (e) {
    return res.status(500).json({
      data: false,
      message: "Server Error. Please try again",
      error: e.message,
    });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match!" });

    const hashedPassword = await bcrypt.hash(password, 13);
    const result = await userDetails.updateOne(
      { email },
      { Password: hashedPassword }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

const logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        const user = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        // await userDetails.updateOne({ email: user.id }, { isLogin: false });
        await userDetails.updateOne({ _id: user.id }, { isLogin: false });

        
        return res.status(200).json({ data: true, message: "Logout Successfull!!!" });
    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error.Please try again!!",error:e });
    }
}


const getUserProfile = async (req, res) => {
  try {
    const user = await userDetails
      .findById(req.user.id)
      .select('Name email lastLogin'); 

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};



const changePassword = async(req, res)=>{
   const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await userDetails.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.Password);

    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

}


export { signup, login, forgotPassword,logout, getUserProfile , changePassword}