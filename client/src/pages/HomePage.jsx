import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const HomePage = () => {
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

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    return (
        <div>
            <h1>HomePage</h1>
            <p>Welcome back! {authUser.username}</p>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    logout();
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default HomePage;
