const { capital, camelize } = require('../utils');
const { log }               = require('../logger');
const path                  = require('path');
const templater             = require('@amjs/templater');
const writer                = require('../writer');

/**
 * Item parser. Extracts all the information of an item and writes the output files.
 * @param   {Object}    item    Extracted item info.
 * @param   {Object}    config  api-parser configuration
 */
module.exports = (item, config) =>
{
    const properties = [];
    Object.keys(item.properties).forEach(
        key =>
        {
            const prop = item.properties[key];
            let type = 'String';
            switch (prop.type)
            {
                case 'integer':
                    type = 'Number';
                    break;
                /* @todo:
                case 'array':
                    type = (prop.items && prop.items.$ref) || type;
                    break;*/
                default:
                    type = `${prop.type.charAt(0).toUpperCase()}${prop.type.substr(1)}`;
                    break;
            }

            let typePath = `@amjs/data-types/src/${type}`;
            if (/#\/components\/schemas\/.+/.test(type))
            {
                type = type.replace(/#\/components\/schemas\/(.+)/, '$1');
                typePath = `./${type}`;
                type = `${capital(camelize(config.namespace))}TypeItem${type}`;
            }

            if (type === '*')
            {
                typePath = null;
            }

            const parsed  = {
                name : key,
                type,
                typePath
            };
            properties.push(parsed);
        }
    );

    const requirements = [];
    properties.forEach(
        prop =>
        {
            if (prop.typePath && !requirements.includes(prop.typePath))
            {
                requirements.push(prop.typePath);
            }
        }
    );
    if (requirements.length)
    {
        requirements.sort();
    }

    const itemContext = Object.assign(
        {},
        config,
        item,
        {
            requirements,
            properties,
            namespace       : [config.namespace, 'type', 'item'].join('-'),
            keySourcePath   : 'type/item',
        }
    );

    const itemPathFile          = path.join(config.paths.items, `${item.key}.js`);
    const testPathFile          = path.join(config.paths.tests.items, `${item.key}.js`);
    const tplItemPath           = path.join(config.paths.templates, 'item.hbs');
    const tplItemTestPath       = path.join(config.paths.templates, 'item-test.hbs');
    const itemFileContent       = templater(tplItemPath, itemContext);
    const testItemFileContent   = templater(tplItemTestPath, itemContext);

    log(`Writing file: "${itemPathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`, item, config, 'blue');
    writer(itemPathFile, itemFileContent, true, false);

    log(`Writing file: "${testPathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`, item, config, 'blue');
    writer(testPathFile, testItemFileContent, true, false);
};
