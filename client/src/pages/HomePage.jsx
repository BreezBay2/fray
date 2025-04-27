import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import Feed from "../components/Feed";
import "../styles/HomePage.css";

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    return (
        <div className="home-page">
            <h1>HomePage</h1>
            <p>Welcome back! {authUser.username}</p>
            <Feed />
        </div>
    );
};

export default HomePage;
