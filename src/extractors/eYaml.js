const fs    = require('fs');
const yaml  = require('yaml');

/**
 * Extracts all the information from a YAML file.
 * @param   {String}    source  YAML file.
 * @return  {Object}    Containing items, collections and services.
 */
module.exports = (source = '') =>
{
    const yamlObj = yaml.parse(fs.readFileSync(source, 'utf-8').toString());

    const collections = [];
    const items = [];

    const schemas = yamlObj.components.schemas;
    Object.keys(schemas).forEach(
        key =>
        {
            const item = schemas[key];
            item.key = key;
            if (item.type === 'array')
            {
                collections.push(item);
            }
            else
            {
                items.push(item);
            }
        }
    );

    const services = yamlObj.paths;
    const basePath = yamlObj.basePath || '';

    return { collections, items, services, basePath };
};