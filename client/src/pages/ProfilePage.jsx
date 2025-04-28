import React, { useEffect } from "react";
import "../styles/ProfilePage.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Feed from "../components/Feed";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const { username } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/user/profile/${username}`);
                const data = res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/user/follow/${userId}`, {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const isMyProfile = authUser._id === user?._id;
    const following = authUser.following.includes(user?._id);

    useEffect(() => {
        refetch();
    }, [username, refetch]);

    return (
        <>
            <div className="profile-page">
                {!isLoading && !isRefetching && user && (
                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="profile-names">
                                <h2 className="profile-fullname">
                                    {user.fullname}
                                </h2>
                                <p className="profile-username">
                                    @{user.username}
                                </p>
                            </div>
                            <img src="/placeholder-avatar.png" />
                        </div>
                        <p>{user.bio}</p>
                        <div className="profile-stats">
                            <p>{user.followers.length} Followers</p>
                            <p>{user.link}</p>
                        </div>
                        {isMyProfile ? (
                            <button className="edit-button">
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                className="follow-button"
                                onClick={() => follow(user?._id)}
                            >
                                {isPending && "Loading..."}
                                {!isPending && following && "Unfollow"}
                                {!isPending && !following && "Follow"}
                            </button>
                        )}
                    </div>
                )}

                <Feed feedType={"userPosts"} username={username} />
            </div>
        </>
    );
};

export default ProfilePage;
