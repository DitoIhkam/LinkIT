import fs from "fs";

export function writeErrorLog(error:any){

    const text =
`[${new Date().toISOString()}]

${error.stack}

`;

    fs.appendFileSync("error.log", text);

}
