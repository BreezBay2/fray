import React, { useEffect } from "react";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";

const Feed = ({ feedType, username }) => {
    const getPostsEndpoint = () => {
        switch (feedType) {
            case "all":
                return "/api/posts/all";
            case "userPosts":
                return `/api/posts/user/${username}`;
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
    }, [username, refetch]);

    return (
        <>
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Feed;
