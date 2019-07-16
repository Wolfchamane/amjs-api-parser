const { collectionParser, itemParser, serviceParser }   = require('./parsers');
const extractor                                         = require('./extractors');

/**
 * Extracts info from a file and parses its content to write ouput files
 * @param   {String}    source  API spec file
 * @param   {Object}    config  api-parser configuration
 */
module.exports = (source = '', config) =>
{
    const { items, collections, services } = extractor(source);

    // items
    items.forEach(item => itemParser(item, config));

    // collections
    collections.forEach(collection => collectionParser(collection, config));

    // paths
    Object.keys(services).forEach(_path => serviceParser(_path, services, config));
};
