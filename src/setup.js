const { camelize, capital } = require('./utils');
const { log }               = require('./logger');
const fs                    = require('fs');
const Handlebars            = require('handlebars');

/**
 * Extract the keys of source object in the order specified and creates its content as a folder.
 * Each key of source of object must be a valid path address.
 * @param   {Object}    source  Container of paths
 * @param   {Array}     order   Order of paths to create
 * @param   {Object}    config  api-parser configuration
 */
const makeDir = (source = {}, order = [], config) =>
{
    order.forEach(
        key =>
        {
            const folderPath = source[key];
            if (!fs.existsSync(folderPath))
            {
                log(`Creating folder "{{folderPath}}"`, { folderPath }, config);
                fs.mkdirSync(folderPath);
            }
        }
    );
};

/**
 * Runs different setups api-parser requires
 * @param   {Object}    config  api-parser configuration object
 */
module.exports = (config = {}) =>
{
    log('Preparing destination folders', null, config);

    makeDir(config.paths, ['src', 'services', 'type', 'collections', 'items', 'logs'], config);
    makeDir(config.paths.tests, ['root', 'unit', 'services', 'type', 'collections', 'items'], config);

    log('Creating Handlebars helpers', null, config);
    Handlebars.registerHelper(
            'camelize',
            value => camelize(value)
    );
    Handlebars.registerHelper(
        'capitalCamelize',
        value => capital(camelize(value))
    );
    Handlebars.registerHelper(
        'dotSep',
        value => camelize(value, '.').toLowerCase()
    );
};