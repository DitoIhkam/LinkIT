import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "mysecretkey";

export async function login(req: Request, res: Response) {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username dan password wajib diisi"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Username atau password salah"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Username atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            token
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}
