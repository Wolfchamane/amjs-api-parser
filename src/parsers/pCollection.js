const { log }   = require('../logger');
const path      = require('path');
const templater = require('@amjs/templater');
const writer    = require('../writer');

/**
 * Collection parser. Extracts all info from a collection and writes the output files.
 * @param collection
 * @param config
 */
module.exports = (collection, config) =>
{
    let itemType = collection.items.$ref;
    itemType = {
        path : itemType.replace('#/components/schemas', '../item'),
        name : itemType.replace('#/components/schemas/', '')
    };

    const collectionContext = Object.assign(
        {},
        config,
        collection,
        {
            itemType,
            namespace : [config.namespace, 'type', 'collection'].join('-')
        }
    );
    const collectionPathFile = path.join(config.paths.collections, `${collection.key}.js`);
    const tplCollectionPath = path.join(config.paths.templates, 'collection.hbs');
    const testCollectionPathFile = path.join(config.paths.tests.collections, `${collection.key}.js`);
    const tplTestCollectionPath = path.join(config.paths.templates, 'collection-test.hbs');

    const collectionFileContent = templater(tplCollectionPath, collectionContext);
    const testCollectionFileContent = templater(tplTestCollectionPath, collectionContext);

    log(
        `Writing file: "${collectionPathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`,
        collection,
        config,
        'blue');
    writer(collectionPathFile, collectionFileContent, true, false);

    log(
        `Writing file: "${testCollectionPathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`,
        collection,
        config,
        'blue');
    writer(testCollectionPathFile, testCollectionFileContent, true, false);
};
