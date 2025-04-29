import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Feed from "../components/Feed";
import { useParams } from "react-router-dom";
import EditUserModal from "../components/EditUserModal";

const ProfilePage = () => {
    const [feedType, setFeedType] = useState("userPosts");
    const [editModal, setEditModal] = useState(false);
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
                const data = await res.json();

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

    useEffect(() => {
        if (editModal === true) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [editModal]);

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
                            <img
                                src={
                                    user?.profileImg ||
                                    "/placeholder-avatar.png"
                                }
                            />
                        </div>
                        <p>{user.bio}</p>
                        <div className="profile-stats">
                            <p className="profile-followers">
                                {user.followers.length} Followers
                            </p>
                            {user.link && <span>•</span>}
                            {user.link && (
                                <a
                                    href={user.link}
                                    target="_blank"
                                    className="profile-link"
                                >
                                    {user.link}
                                </a>
                            )}
                        </div>
                        {isMyProfile ? (
                            <button
                                className="edit-button"
                                onClick={() => setEditModal(true)}
                            >
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

                <div className="profile-feeds">
                    <div
                        className={
                            feedType === "userPosts"
                                ? "profile-posts-active"
                                : "profile-posts"
                        }
                        onClick={() => setFeedType("userPosts")}
                    >
                        Posts
                    </div>
                    <div
                        className={
                            feedType === "likes"
                                ? "profile-likes-active"
                                : "profile-likes"
                        }
                        onClick={() => setFeedType("likes")}
                    >
                        Likes
                    </div>
                </div>

                <Feed
                    feedType={feedType}
                    username={username}
                    userId={user?._id}
                />
            </div>
            {editModal && (
                <EditUserModal
                    authUser={authUser}
                    closeModal={() => {
                        setEditModal(false);
                    }}
                />
            )}
        </>
    );
};

export default ProfilePage;
