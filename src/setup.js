const { decamelize, camelize, capitalize, dotProp } = require('@amjs/utils');
const { makeFolder }                                = require('@amjs/utils-fs');
const fs                                            = require('fs');
const Handlebars                                    = require('handlebars');

const ormBasics = ['string', 'number', 'boolean', 'object', 'array', 'collection', 'date', 'password'];

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

const countChar = (value = '', char = '') =>
{
    let acum = 0;
    if (value)
    {
        for (let i = value.length - 1, l = 0; i >= l; i--)
        {
            if (value[i] === char)
            {
                acum++;
            }
        }
    }
    return acum;
};

const filePath = (value = '') =>
{
    value = decamelize(value).split('-');
    return value.map((it, id) => id === value.length - 1 ? capitalize(it) : it).join('/');
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
    Handlebars.registerHelper('camelize', value => camelize(value));
    Handlebars.registerHelper('capitalCamelize', value => capitalize(camelize(value)));
    Handlebars.registerHelper('dotSep', value => decamelize(value, '.').toLowerCase());
    Handlebars.registerHelper('parseRequirement',
        value =>
        {
            value = value.toLowerCase() === 'integer' ? 'number' : value;
            if (ormBasics.includes(value.toLowerCase()))
            {
                value = `@amjs/data-types/src/${capitalize(value)}.js`;
            }
            else
            {
                value = `./${filePath(value)}`;
            }

            return value;
        }
    );
    Handlebars.registerHelper('filePath', value => filePath(value));
    Handlebars.registerHelper('collectionPath', value =>
    {
        let base = '../../../../src/type/collection';
        value = filePath(value);
        for (let i = 0, l = countChar(value, '/') - 1; i <= l; i++)
        {
            base = `../${base}`;
        }

        return `${base}/${value}`;
    });
};