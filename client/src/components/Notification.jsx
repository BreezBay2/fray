import React from "react";
import "../styles/components/Notification.css";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { FaComment, FaUser } from "react-icons/fa";
import { formatPostDate } from "../utils/dateFormatter";

const Notification = ({ notification }) => {
    return (
        <div className="notification-container">
            <div className="notification-icon">
                {notification.type === "like" && (
                    <FaHeart className="like" size={30} />
                )}
                {notification.type === "follow" && (
                    <FaUser className="follow" size={30} />
                )}
                {notification.type === "comment" && (
                    <FaComment className="comment" size={30} />
                )}
            </div>

            <Link
                to={`/profile/${notification.from.username}`}
                className="notification-link"
            >
                <img src={notification.from.profileImg} />
                <span className="notification-user">
                    {notification.from.username}
                </span>
            </Link>
            {notification.type === "follow" && <span>followed you</span>}
            {notification.type === "like" && <span>liked your post</span>}
            {notification.type === "comment" && (
                <span>commented on your post</span>
            )}

            <span className="notification-time">
                {formatPostDate(notification.createdAt)}
            </span>
        </div>
    );
};

export default Notification;
