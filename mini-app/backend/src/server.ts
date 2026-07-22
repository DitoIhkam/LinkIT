import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route";
import coffeeRoute from "./routes/coffee.route";
import transactionRoute from "./routes/transaction.route";

import { authenticate } from "./middleware/auth.middleware";
import { logger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(logger);

// ======================
// Routes
// ======================
app.use(authRoute);
app.use(coffeeRoute);
app.use(transactionRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Mini App API Running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP"
    });
});

// Route untuk test Error Handler
app.get("/error", (req, res) => {
    throw new Error("Ini contoh error");
});

// Protected Route
app.get("/profile", authenticate, (req, res) => {
    res.json({
        username: "admin",
        role: "Administrator"
    });
});

// ======================
// Global Error Handler
// ======================
app.use(errorHandler);

const PORT = 3000;

app.get("/slow", async (req, res) => {

    await new Promise(resolve =>
        setTimeout(resolve, 2500)
    );

    res.json({
        message: "Slow endpoint"
    });

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

