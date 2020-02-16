exports = function() {

    const fs = require('fs')
    const dotenv = require('dotenv')

    const defaultEnvFileName = ".env";

    const defaultEnvs = dotenv.parse(fs.readFileSync(defaultEnvFileName)); // load envs variables from .env file

    // if NODE_ENV exists in .env file it'll be seted
    if (defaultEnvs["NODE_ENV"])
        process.env["NODE_ENV"] = defaultEnvs["NODE_ENV"];

    // Look for the variable NODE_ENV in the execution arguments and, if exists, it'll be seted
    for (let i = 0; i < process.argv.length; i++) {
        let val = process.argv[i];
        if (val.match(/^-ENODE_ENV=.+/g)) {
            val = val.slice(2);
            [ key, value ] = val.split("=");
            process.env[key] = value;
            break;
        }
    }

    const envFileName = defaultEnvFileName + "." + process.env.NODE_ENV;

    // make configuration of specific enviroment file .env.x
    dotenv.config({
        path: envFileName
    });
    
    // make configuration of general enviroment file .env
    dotenv.config();

    // all enviroments arguments are marked with "-E" prefix.
    // on this section all of these arguments will be transferred to the program enviroment variables 
    process.argv.forEach((val, index) => {
        if (val.match(/^-E.+=.+/g)) {
            val = val.slice(2);
            [ key, value ] = val.split("=");
            process.env[key] = value;
        }
    });

}();