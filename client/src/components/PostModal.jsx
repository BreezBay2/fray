import React, { useEffect, useRef, useState } from "react";
import "../styles/components/PostModal.css";
import { Link } from "react-router-dom";
import { formatPostDate } from "../utils/dateFormatter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PostModal = ({ post, closeModal }) => {
    const postUser = post.user;
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();
    const textAreaRef = useRef();
    const formattedDate = formatPostDate(post.createdAt);
    const [comment, setComment] = useState("");

    useEffect(() => {
        textAreaRef.current.focus();
    });

    const {
        mutate: commentPost,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/comment/${post._id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: comment }),
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
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const handleComment = (e) => {
        e.preventDefault();
        if (isPending) {
            return;
        }
        commentPost();
    };

    return (
        <div
            className="post-modal-container"
            onClick={(e) => {
                if (e.target.className === "post-modal-container") closeModal();
            }}
        >
            <div className="post-modal">
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
                </div>
                <div className="post-content">
                    <p>{post.text}</p>
                    {post.img && <img src={post.img} />}
                </div>
                <div className="comment-divider" />

                <div className="comment">
                    <img
                        src={authUser.profileImg || "/placeholder-avatar.png"}
                    />
                    <textarea
                        ref={textAreaRef}
                        placeholder="Comment something..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <button className="comment-button" onClick={handleComment}>
                    {isPending ? "Commenting..." : "Comment"}
                </button>
                {isError && (
                    <div className="error-message">{error.message}</div>
                )}
                {post.comments.length !== 0 && (
                    <div className="comment-divider" />
                )}
                {post.comments.map((comment) => (
                    <div key={comment._id} className="commented-container">
                        <img
                            src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                            }
                        />
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostModal;
