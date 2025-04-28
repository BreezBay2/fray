import React, { useEffect } from "react";
import Post from "./Post";
import "../styles/components/Feed.css";
import { useQuery } from "@tanstack/react-query";

const Feed = ({ feedType, username, userId }) => {
    const getPostsEndpoint = () => {
        switch (feedType) {
            case "all":
                return "/api/posts/all";
            case "userPosts":
                return `/api/posts/user/${username}`;
            case "following":
                return "/api/posts/following";
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POSTS_ENDPOINT = getPostsEndpoint();

    const {
        data: posts,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch(POSTS_ENDPOINT);
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

    useEffect(() => {
        refetch();
    }, [username, refetch, feedType]);

    return (
        <>
            {!isLoading && !isRefetching && posts && (
                <div className="feed">
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Feed;
