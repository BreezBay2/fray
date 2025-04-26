import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
import "../styles/Post.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPostDate } from "../utils/dateFormatter";

const Post = ({ post }) => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();
    const postUser = post.user;
    const isMyPost = authUser._id === post.user._id;
    const isLiked = post.likes.includes(authUser._id);
    const formattedDate = formatPostDate(post.createdAt);

    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/like/${post._id}`, {
                    method: "POST",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (updatedLikes) => {
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                });
            });
        },
    });

    const handleLikePost = () => {
        if (isLiking) {
            return;
        }
        likePost();
    };

    return (
        <div className="post-container">
            <div className="post-user">
                <Link to="/profile">
                    <img
                        className="post-avatar"
                        src="/placeholder-avatar.png"
                    />
                </Link>
                <div className="post-data">
                    <Link to="/profile" className="post-names">
                        <p className="post-fullname">{postUser.fullname}</p>
                        <p>-</p>
                        <p className="post-username">@{postUser.username}</p>
                    </Link>
                    <p className="post-timestamp">{formattedDate}</p>
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
                <div
                    className={isLiked ? "liked-container" : "like-container"}
                    onClick={handleLikePost}
                >
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
