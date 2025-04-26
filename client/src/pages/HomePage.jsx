import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    return (
        <div>
            <h1>HomePage</h1>
            <p>Welcome back! {authUser.username}</p>
        </div>
    );
};

export default HomePage;
