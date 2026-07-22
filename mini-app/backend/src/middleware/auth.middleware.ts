import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "mysecretkey";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token tidak ditemukan"
        });
    }

    const token = authHeader.replace("Bearer ", "");

    try {

        jwt.verify(token, SECRET);

        next();

    } catch {

        return res.status(401).json({
            message: "Token tidak valid"
        });

    }

}
