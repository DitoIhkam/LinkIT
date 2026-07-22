import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let errorCounter = 0;

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    errorCounter++;

    const text =
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n${err.message}\n\n`;

    console.error(text);

    fs.appendFileSync(
        path.join(logDir, "error.log"),
        text
    );

    if (errorCounter > 3) {

        console.log("=================================");
        console.log("🚨 ALERT !!");
        console.log(`Total Error : ${errorCounter}`);
        console.log("=================================");

    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

}