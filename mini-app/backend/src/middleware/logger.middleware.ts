import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export function logger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        const text =
            `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration} ms`;

        console.log(text);

        // Simpan request log
        fs.appendFileSync(
            path.join(logDir, "request.log"),
            text + "\n"
        );

        // Slow response (>1000 ms)
        if (duration > 1000) {
            const slow =
                `[${new Date().toISOString()}] SLOW REQUEST -> ${text}\n`;

            console.warn(slow);

            fs.appendFileSync(
                path.join(logDir, "slow.log"),
                slow
            );
        }
    });

    next();
}