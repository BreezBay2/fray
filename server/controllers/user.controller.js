import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in Get User Profile Controller.", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user._id);
        const targetUser = await User.findById(id);

        if (id === req.user._id.toString()) {
            return res
                .status(400)
                .json({ error: "Can't follow or unfollow yourself." });
        }

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        const isFollowing = currentUser.following.includes(id);

        if (!isFollowing) {
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            });

            const notification = new Notification({
                type: "follow",
                from: req.user._id,
                to: targetUser._id,
            });

            await notification.save();

            res.status(200).json({ message: "User followed successfully." });
        } else {
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id },
            });

            res.status(200).json({ message: "User unfollowed successfully." });
        }
    } catch (error) {
        console.log("Error in FollowUnfollow Controller.", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const updateUser = async (req, res) => {
    let { fullname, bio, link, currentPassword, newPassword, profileImg } =
        req.body;

    const currentUser = req.user._id;

    try {
        let user = await User.findById(currentUser);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (
            (!currentPassword && newPassword) ||
            (currentPassword && !newPassword)
        ) {
            return res.status(400).json({
                error: "Please provide both the current password and the new password.",
            });
        }

        if (currentPassword && newPassword) {
            const passwordConfirmation = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!passwordConfirmation)
                return res
                    .status(400)
                    .json({ error: "Current password is incorrect." });

            if (newPassword < 6) {
                return res.status(400).json({
                    error: "New password must be at least 6 characters long.",
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(
                    user.profileImg.split("/").pop().split(".")[0]
                );
            }

            const uploadedResponse = await cloudinary.uploader.upload(
                profileImg
            );
            profileImg = uploadedResponse.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in Update User Controller. ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = req.user._id;

        const usersFollowed = await User.findById(currentUser).select(
            "following"
        );

        const users = await User.aggregate([
            { $match: { _id: { $ne: currentUser } } },
            { $sample: { size: 10 } },
        ]);

        const filteredUsers = users.filter(
            (user) => !usersFollowed.following.includes(user._id)
        );

        const suggestedUsers = filteredUsers.slice(0, 5);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in Get Suggested Users Controller. ", error.message);
        res.status(500).json({ error: error.message });
    }
};
