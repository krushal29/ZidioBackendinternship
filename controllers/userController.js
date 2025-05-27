import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userDetails from '../models/UserModel.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN_KEY);
}

const signup = async (req, res) => {
    try {
        const { UserName, UserEmail, Password } = req.body;
        if (!UserName || !UserEmail || !Password) return res.status(400).json({ data: false, message: "Please fill the details" });
        
        const existingUser = await userDetails.findOne({ email: UserEmail });
        if (existingUser) {
            return res.status(400).json({ data: false, message: "user already exits.Please Try again!!!" });
        }
        
        const hashedPassword = await bcrypt.hash(Password, 13);
        
        const userData = {
            Name: UserName,
            email: UserEmail,
            Password: hashedPassword,
        }
        const user = await userDetails.create(userData);
        const token = createToken(user.email);
        if (!user) {
            return res.status(500).json({ data: false, message: "Failed to create user. Please try again later." });
        }
        else {
            await userDetails.updateOne({ email: UserEmail }, { isLogin: true });
            return res.status(200).json({ data: true, message: "Data added!!", token, role: user.role });
        }


    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error!", error: e })
    }
}

const login = async (req, res) => {
  try {

        const { Email, Password } = req.body;

        if (!Email || !Password) return res.status(400).json({ data: false, message: "Please Fill all the Fields" });

        const user = await userDetails.findOne({ email: Email });

        if (user) {
            const ComparePassword = await bcrypt.compare(Password, user.Password);
            if (ComparePassword) {
                const token = createToken(user._id);
                await userDetails.updateOne({ email: Email }, { isLogin: true });
                return res.status(200).json({ data: true, message: "login Successfull", token, role: user.role });
            } else {
                return res.status(401).json({ data: false, message: "Incorrect password" })
            }

        } else {
            return res.status(404).json({ data: false, message: "User not found" });
        }
    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error.Please try again", error: e.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { FormData } = req.body;
        if (!(FormData.password === FormData.confirmPassword)) return res.status(201).json({ data: false, message: "Password does not Same!!!" });

        const hashedPassword = await bcrypt.hash(FormData.password, 13);

        await userDetails.updateOne({ email: FormData.email }, { Password: hashedPassword })

        return res.status(200).json({ data: true });
    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error", error: e })
    }
}

const logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        const user = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        await userDetails.updateOne({ email: user.id }, { isLogin: false });


        return res.status(200).json({ data: true, message: "Logout Successfull!!!" });
    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error.Please try again!!",error:e });
    }
}



export { signup, login, forgotPassword,logout }