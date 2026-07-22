import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export function writeTransactionLog(message: string) {
    const file = path.join(logDir, "transaction.log");

    const text = `[${new Date().toISOString()}] ${message}\n`;

    fs.appendFileSync(file, text);
}
