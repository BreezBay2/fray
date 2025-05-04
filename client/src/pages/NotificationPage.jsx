import React from "react";
import "../styles/NotificationPage.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "../components/Notification";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }

                queryClient.invalidateQueries({ queryKey: ["notification"] });

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    return (
        <div className="notification-page">
            <h1>Notifications</h1>
            <div className="notifications-container">
                {isLoading && <h1>Loading...</h1>}
                {notifications?.length === 0 && <h2>No Notifications</h2>}
                {notifications?.map((notification) => (
                    <Notification
                        notification={notification}
                        key={notification.key}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationPage;
