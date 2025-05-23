import Notification from "../models/notification.model.js";

export const checkNewNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification.findOne({
            to: userId,
            read: false,
        });

        if (!notification) {
            return res.status(200).send({ result: false });
        }

        res.status(200).json({ result: true });
    } catch (error) {
        console.log("Error in Check New Notifications Controller.", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({
            to: userId,
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "from",
                select: "username profileImg",
            });

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in Get Notifications Controller. ", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params._id;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found." });
        }

        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({
                error: "You are not authorized to delete this notification.",
            });
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ message: "Notification deleted successfully." });
    } catch (error) {
        console.log("Error in Delete Notification Controller", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
