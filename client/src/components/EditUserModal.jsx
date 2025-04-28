import React, { useEffect, useRef, useState } from "react";
import "../styles/EditUserModal.css";

const EditUserModal = ({ authUser, closeModal }) => {
    const [profileImg, setProfileImg] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        bio: "",
        link: "",
        currentPassword: "",
        newPassword: "",
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

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImg(reader.result);
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
                <form className="edit-form">
                    <div className="edit-name">
                        <img
                            src={profileImg || "/placeholder-avatar.png"}
                            onClick={() => profileImgRef.current.click()}
                        />
                        <input
                            type="file"
                            ref={profileImgRef}
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
