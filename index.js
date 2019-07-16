#!/usr/bin/env node

const { log, error, debug, checkLog, dumpLog }  = require('./src/logger');
const buildConfig                               = require('./src/build-config');
const fileExtractor                             = require('./src/file-extractor');
const setup                                     = require('./src/setup');
const args                                      = process.argv.splice(2);

let config = {
    date    : (new Date()).toISOString(),
    clean   : true,
    debug   : false,
    paths   : {}
};

try
{
    buildConfig(args, config);

    checkLog(config);
    log('{{package.name}} {{package.version}}', config, config, 'bold');

    if (config.debug)
    {
        debug('Running with config:\n{{config}}', { config : JSON.stringify(config, null, 4) }, config, 'italic');
    }

    setup(config);

    if (config.paths.isFile)
    {
        fileExtractor(config.paths.source, config);
    }
    // @todo: folderExtractor

    dumpLog(config);

    require('./src/post-run')();

    process.exit(0);
}
catch (e)
{
    config.clean = false;
    checkLog(config);
    error(e, config);
    console.log(`[@amjs/api-parser] [ERROR] Review trace at "${config.logFile}"`);
    dumpLog(config);
    process.exit(1);
}
