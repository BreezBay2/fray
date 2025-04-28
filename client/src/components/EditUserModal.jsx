import React, { useEffect, useRef, useState } from "react";
import "../styles/EditUserModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditUserModal = ({ authUser, closeModal }) => {
    const queryClient = useQueryClient();
    // const [profileImg, setProfileImg] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        bio: "",
        link: "",
        currentPassword: "",
        newPassword: "",
        profileImg: null,
    });

    const profileImgRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullname: authUser.fullname,
                bio: authUser.bio,
                link: authUser.link,
                currentPassword: "",
                newPassword: "",
            });
        }
    }, [authUser]);

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async ({
            fullname,
            bio,
            link,
            currentPassword,
            newPassword,
            profileImg,
        }) => {
            try {
                console.log(formData);
                const res = await fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullname,
                        bio,
                        link,
                        currentPassword,
                        newPassword,
                        profileImg,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }

                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
                queryClient.invalidateQueries({ queryKey: ["posts"] }),
            ]);
        },
    });

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setProfileImg(reader.result);
                setFormData({
                    ...formData,
                    [e.target.name]: reader.result,
                });
                console.log(formData);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className="edit-modal-container"
            onClick={(e) => {
                if (e.target.className === "edit-modal-container") {
                    closeModal();
                }
            }}
        >
            <div className="edit-modal">
                <form
                    className="edit-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateProfile(formData);
                        closeModal();
                    }}
                >
                    <div className="edit-name">
                        <img
                            src={
                                formData.profileImg ||
                                authUser.profileImg ||
                                "/placeholder-avatar.png"
                            }
                            onClick={() => profileImgRef.current.click()}
                        />
                        <input
                            type="file"
                            ref={profileImgRef}
                            name="profileImg"
                            hidden
                            onChange={(e) => handleImgChange(e)}
                        />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                        />
                    </div>

                    <textarea
                        placeholder="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                    />
                    <div className="edit-passwords">
                        <input
                            type="password"
                            placeholder="Your current password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            placeholder="Your new password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    <input
                        text="text"
                        placeholder="Link"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                    />
                    <button>Done</button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
