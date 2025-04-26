import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
import "../styles/Post.css";
import { useQuery } from "@tanstack/react-query";

const Post = ({ post }) => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const postUser = post.user;
    const isMyPost = authUser._id === post.user._id;

    return (
        <div className="post-container">
            <div className="post-user">
                <Link to="/profile">
                    <img
                        className="post-avatar"
                        src="/placeholder-avatar.png"
                    />
                </Link>
                <div>
                    <Link to="/profile" className="post-names">
                        <p className="post-fullname">{postUser.fullname}</p>
                        <p>-</p>
                        <p className="post-username">@{postUser.username}</p>
                    </Link>
                    <p className="post-timestamp">2 hours ago</p>
                </div>
                {isMyPost && (
                    <div class="delete-button">
                        <FaTrash className="delete-icon" />
                    </div>
                )}
            </div>
            <div className="post-text">
                <p>{post.text}</p>
            </div>
            <div className="post-interactions">
                <div className="like-container">
                    <FaRegHeart />
                    <p>{post.likes.length}</p>
                </div>
                <div className="comment-container">
                    <FaRegComment />
                    <p>{post.comments.length}</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
