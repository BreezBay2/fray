import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Feed from "../components/Feed";
import "../styles/HomePage.css";

const HomePage = () => {
    const [feedType, setFeedType] = useState("all");
    return (
        <div className="home-page">
            <div className="home-feeds">
                <div
                    className={
                        feedType === "all"
                            ? "home-foryou-active"
                            : "home-foryou"
                    }
                    onClick={() => setFeedType("all")}
                >
                    For You
                </div>
                <div
                    className={
                        feedType === "following"
                            ? " home-following-active"
                            : "home-following"
                    }
                    onClick={() => setFeedType("following")}
                >
                    Following
                </div>
            </div>
            <Feed feedType={feedType} />
        </div>
    );
};

export default HomePage;
