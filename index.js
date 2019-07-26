#!/usr/bin/env node

const AmjsApiParser = require('./src/Parser');
const buildConfig = require('./src/build-config');
const args                                      = process.argv.splice(2);

let config = {
    date    : (new Date()).toISOString(),
    paths   : {}
};

try
{
    buildConfig(args, config);
    (new AmjsApiParser(config)).parse();
    require('./src/post-run')();

    process.exit(0);
}
catch (e)
{
    console.log(`[@amjs/api-parser] [ERROR] Review trace at "${config.logFile}"`);
}
