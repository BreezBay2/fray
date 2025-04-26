export const formatPostDate = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDiffInSeconds = Math.floor(currentDate - createdAtDate) / 1000;
    const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    const timeDiffInDays = Math.floor(timeDiffInHours / 24);

    if (timeDiffInDays > 1) {
        return createdAtDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    } else if (timeDiffInDays === 1) {
        return "1d ago";
    } else if (timeDiffInHours >= 1) {
        return `${timeDiffInHours}h ago`;
    } else if (timeDiffInMinutes >= 1) {
        return `${timeDiffInMinutes}m ago`;
    } else {
        return "Just now";
    }
};
