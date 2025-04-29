import React, { useEffect, useRef, useState } from "react";
import "../styles/components/CreatePostModal.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const CreatePostModal = ({ closeModal }) => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const textAreaRef = useRef();
    const imgRef = useRef(null);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
        mutationFn: async ({ text, img }) => {
            try {
                const res = await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text, img }),
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

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost({ text, img });
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
                    <img
                        src={authUser.profileImg || "/placeholder-avatar.png"}
                    />
                    <textarea
                        ref={textAreaRef}
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                {img && (
                    <div className="create-image-container">
                        <MdCancel
                            className="create-image-cancel"
                            onClick={() => {
                                setImg(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img src={img} />
                    </div>
                )}
                <FaRegImage
                    className="create-image-button"
                    size={23}
                    onClick={() => imgRef.current.click()}
                />
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imgRef}
                    onChange={handleImgChange}
                />
                {isError && <div>{error.message}</div>}
            </div>
        </div>
    );
};

export default CreatePostModal;
