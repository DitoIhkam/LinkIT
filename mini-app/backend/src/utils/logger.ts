import fs from "fs";

export function writeTransactionLog(message: string) {

    const text =
`[${new Date().toISOString()}]
${message}

`;

    fs.appendFileSync("transaction.log", text);
}
