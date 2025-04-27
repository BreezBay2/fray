import React, { useEffect, useRef, useState } from "react";
import "../styles/CreatePostModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePostModal = ({ closeModal }) => {
    const [text, setText] = useState("");
    const textAreaRef = useRef();

    const queryClient = useQueryClient();

    useEffect(() => {
        textAreaRef.current.focus();
    });

    const {
        mutate: createPost,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ text }) => {
            try {
                const res = await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text }),
                });
                const data = res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            setText("");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            closeModal();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost({ text });
    };

    return (
        <div
            className="create-modal-container"
            onClick={(e) => {
                if (e.target.className === "create-modal-container")
                    closeModal();
            }}
        >
            <div className="create-modal">
                <div className="create-modal-buttons">
                    <button
                        onClick={(e) => {
                            closeModal();
                        }}
                    >
                        Cancel
                    </button>
                    <button onClick={handleSubmit}>
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>
                <div className="modal-center">
                    <img src="/placeholder-avatar.png" />
                    <form>
                        <textarea
                            ref={textAreaRef}
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
