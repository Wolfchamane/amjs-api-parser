// Requires item type class
require('../item/User');
// --------------------------- /
const { AmjsDataTypesCollection } = require('@amjs/data-types');

/**
* @NOTICE: DO NOT MODIFY THIS FILE, generated with '@amjs/api-parser'
* @created 2019-07-16T10:36:45.141Z
*
* Collection of users
* @namespace   amjs.api.parser.type.collection
* @class       amjs.api.parser.type.collection.Users
* @extends     amjs.dataTypes.Object
*/
class AmjsApiParserTypeCollectionUsers extends AmjsDataTypesCollection
{
    /**
     * @inheritDoc
     */
    constructor(values)
    {
        super();
        this.$itemType = 'User';
        this.value = values;
    }
}

// Register and export collection class
AmjsDataTypesCollection.register('AmjsApiParserTypeCollectionUsers', AmjsApiParserTypeCollectionUsers);
module.exports = AmjsApiParserTypeCollectionUsers;