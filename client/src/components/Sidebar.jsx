import React from "react";
import "../styles/SideBar.css";
import { Link } from "react-router-dom";
import { IoHome, IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const Sidebar = () => {
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

    return (
        <div className="sidebar-container">
            <div className="sidebar-content">
                <Link to="/" className="sidebar-link">
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
                        <Link to="/" className="sidebar-link">
                            <FaUser size={20} />
                            <h2>Profile</h2>
                        </Link>
                    </li>
                </ul>
                <Link to="/" className="sidebar-account-link">
                    <div className="sidebar-avatar">
                        <img src="/placeholder-avatar.png" />
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
    );
};

export default Sidebar;
