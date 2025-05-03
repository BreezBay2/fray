import React, { useEffect, useState } from "react";
import "../styles/components/SideBar.css";
import { Link } from "react-router-dom";
import { IoCreateOutline, IoHome, IoLogOutOutline } from "react-icons/io5";
import { FaUser, FaBell } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CreatePostModal from "./CreatePostModal";

const Sidebar = () => {
    const [postModal, setPostModal] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                });

                const authUser = await res.json();

                if (!res.ok) {
                    throw new Error(authUser.error || "Something went wrong.");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    useEffect(() => {
        if (postModal === true) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [postModal]);

    return (
        <>
            <div className="sidebar-container">
                <div className="sidebar-content">
                    <Link to="/" className="sidebar-logo">
                        <h1>Fray</h1>
                    </Link>
                    <ul>
                        <li>
                            <Link to="/" className="sidebar-link">
                                <IoHome size={20} />
                                <h2>Home</h2>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/notifications"}
                                className="sidebar-link"
                            >
                                <FaBell size={20} />
                                <h2>Notifications</h2>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/profile/${authUser.username}`}
                                className="sidebar-link"
                            >
                                <FaUser size={20} />
                                <h2>Profile</h2>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="create-button"
                                onClick={() => setPostModal(true)}
                            >
                                <IoCreateOutline size={20} />
                                Post
                            </button>
                        </li>
                    </ul>
                    <Link
                        to={`/profile/${authUser.username}`}
                        className="sidebar-account-link"
                    >
                        <div className="sidebar-avatar">
                            <img
                                src={
                                    authUser.profileImg ||
                                    "/placeholder-avatar.png"
                                }
                            />
                        </div>
                        <div className="sidebar-account">
                            <div>
                                <p className="sidebar-fullname">
                                    {authUser.fullname}
                                </p>
                                <p className="sidebar-username">
                                    @{authUser.username}
                                </p>
                            </div>
                            <IoLogOutOutline
                                className="logout-button"
                                size={25}
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}
                            />
                        </div>
                    </Link>
                </div>
            </div>
            {postModal && (
                <CreatePostModal
                    closeModal={() => {
                        setPostModal(false);
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;
