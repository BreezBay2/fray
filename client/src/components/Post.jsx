import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
import "../styles/components/Post.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPostDate } from "../utils/dateFormatter";
import PostModal from "./PostModal";

const Post = ({ post }) => {
    const [postModal, setPostModal] = useState(false);
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

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}`, {
                    method: "DELETE",
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const handleDeletePost = () => {
        deletePost();
    };

    const handleLikePost = () => {
        if (isLiking) {
            return;
        }
        likePost();
    };

    useEffect(() => {
        if (postModal === true) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [postModal]);

    return (
        <>
            <div className="post-container">
                <div className="post-user">
                    <Link to={`/profile/${postUser.username}`}>
                        <img
                            className="post-avatar"
                            src={
                                postUser.profileImg || "/placeholder-avatar.png"
                            }
                        />
                    </Link>
                    <div className="post-data">
                        <Link
                            to={`/profile/${postUser.username}`}
                            className="post-names"
                        >
                            <p className="post-fullname">{postUser.fullname}</p>
                            <p>-</p>
                            <p className="post-username">
                                @{postUser.username}
                            </p>
                        </Link>
                        <p className="post-timestamp">{formattedDate}</p>
                    </div>
                    {isMyPost && (
                        <div className="delete-button">
                            {!isDeleting && (
                                <FaTrash
                                    className="delete-icon"
                                    onClick={handleDeletePost}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="post-content">
                    <p>{post.text}</p>
                    {post.img && <img src={post.img} />}
                </div>
                <div className="post-interactions">
                    <div
                        className={
                            isLiked ? "liked-container" : "like-container"
                        }
                        onClick={handleLikePost}
                    >
                        <FaRegHeart />
                        <p>{post.likes.length}</p>
                    </div>
                    <div
                        className="comment-container"
                        onClick={() => setPostModal(true)}
                    >
                        <FaRegComment />
                        <p>{post.comments.length}</p>
                    </div>
                </div>
            </div>
            {postModal && (
                <PostModal
                    post={post}
                    closeModal={() => {
                        setPostModal(false);
                    }}
                />
            )}
        </>
    );
};

export default Post;
