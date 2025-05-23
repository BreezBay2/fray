import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password, confirmPassword } =
            req.body;

        if (!username || !fullname || !email || !password || !confirmPassword) {
            return res
                .status(400)
                .json({ error: "Please fill out all fields." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email Format." });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken." });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "E-Mail is already taken" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters long" });
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ error: "Password confirmation failed." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            fullname: fullname,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
            });
        } else {
            res.status(400).json({ error: "Invalid User Data." });
        }
    } catch (error) {
        console.log("Error in signup Controller.", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const passwordCheck = await bcrypt.compare(
            password,
            user?.password || ""
        );

        if (!user || !passwordCheck) {
            return res
                .status(400)
                .json({ error: "Invalid username or password." });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
        });
    } catch (error) {
        console.log("Error in Login Controller.", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Successful." });
    } catch (error) {
        console.log("Error in Logout Controller.", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in Get Current User Controller", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
