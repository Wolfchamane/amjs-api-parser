const { dotProp }       = require('@amjs/utils');
const { makeFolder }    = require('@amjs/utils-fs');
const fs                = require('fs');
const path              = require('path');

/**
 * Extract the keys of source object in the order specified and creates its content as a folder.
 * Each key of source of object must be a valid path address.
 * @param   {Object}    source  Container of paths
 * @param   {Array}     order   Order of paths to create
 */
const makeDir = (source = {}, order = []) =>
{
    order.forEach(
        key =>
        {
            const folderPath = dotProp(source, key);
            if (!fs.existsSync(folderPath))
            {
                source.logger.log(`Creating folder {{folderPath}}`, { folderPath });
                makeFolder(folderPath);
            }
        }
    );
};

/**
 * Runs different setups api-parser requires
 * @param   {Object}    parser  Parser instance
 */
module.exports = (parser = {}) =>
{
    parser.logger.log('Creating required folders');
    makeDir(parser, [
        'config.paths.output.root',
        'config.paths.output.services',
        'config.paths.output.type',
        'config.paths.output.collections',
        'config.paths.output.items',
        'config.paths.tests.root',
        'config.paths.tests.unit',
        'config.paths.tests.services',
        'config.paths.tests.type',
        'config.paths.tests.collections',
        'config.paths.tests.items'
    ]);

    parser.logger.log('Setting up Handlebars helpers');
    require(path.join(parser.config.paths.templates.root, 'helpers.js'));
};