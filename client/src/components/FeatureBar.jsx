import { useQuery } from "@tanstack/react-query";
import React from "react";
import "../styles/components/FeatureBar.css";
import { Link } from "react-router-dom";

const FeatureBar = () => {
    const { data: suggestedUsers, isLoading } = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/user/suggested");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    return (
        <div className="feature-container">
            <div className="featured-users">
                <h2>Check out these users</h2>

                {!isLoading &&
                    suggestedUsers.map((user) => (
                        <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="featured-user"
                        >
                            <img
                                className="featured-image"
                                src={
                                    user.profileImg || "/placeholder-avatar.png"
                                }
                            />
                            <div className="featured-names">
                                <p className="featured-fullname">
                                    {user.fullname}
                                </p>
                                <p className="featured-username">
                                    @{user.username}
                                </p>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default FeatureBar;
