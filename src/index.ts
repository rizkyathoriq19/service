import "dotenv/config";
import "./paths";
import app from "./app/instance";

function parseArguments(args: string[]): Record<string, string> {
    const parsedArgs: Record<string, string> = {};

    for (let i = 2; i < args.length; i += 2) {
        const argClean = args[i].replace(/^--/, '');    
        const argName = argClean.split("=")[0] || '';
        const argValue = argClean.split("=")[1] || '';
        parsedArgs[argName] = argValue;
    }

    return parsedArgs;
}

const parsedArgs = parseArguments(process.argv);

if (parsedArgs["service"] == "rest") {
    app.restApp()
}