// Required base data types
require('@amjs/data-types/src/Number');
require('@amjs/data-types/src/String');
// ------------------------ /
const { AmjsDataTypesObject } = require('@amjs/data-types');

/**
 * @NOTICE: DO NOT MODIFY THIS FILE, generated with '@amjs/api-parser'
 * @created 2019-07-16T10:36:45.141Z
 *
 * User instance
 * @namespace   amjs.api.parser.type.item
 * @class       amjs.api.parser.type.item.User
 * @extends     amjs.dataTypes.Object
 */
class AmjsApiParserTypeItemUser extends AmjsDataTypesObject
{
    /**
     * @inheritDoc
     */
    constructor(values)
    {
        super();

        this.$propertyTypes = {
            id: 'Number',
            name: 'String',
        };

        this.id = null;
        this.name = null;

        this._setProperties(values);
    }
}

// Register and export class
AmjsDataTypesObject.register('AmjsApiParserTypeItemUser', AmjsApiParserTypeItemUser);
module.exports = AmjsApiParserTypeItemUser;