import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Server ready");
});

app.listen(8000, () => {
    "Server is running on PORT 8000";
});
