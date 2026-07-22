import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Mini App Backend Running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});