// Required base data types
require('@amjs/data-types/src/Number');
require('@amjs/data-types/src/String');
// ------------------------ /
const { AmjsDataTypesObject } = require('@amjs/data-types');

/**
 * @NOTICE: DO NOT MODIFY THIS FILE, generated with '@amjs/api-parser'
 * @created 2019-07-16T10:36:45.141Z
 *
 * Error object instance
 * @namespace   amjs.api.parser.type.item
 * @class       amjs.api.parser.type.item.Error
 * @extends     amjs.dataTypes.Object
 */
class AmjsApiParserTypeItemError extends AmjsDataTypesObject
{
    /**
     * @inheritDoc
     */
    constructor(values)
    {
        super();

        this.$propertyTypes = {
            code: 'Number',
            message: 'String',
        };

        this.code = null;
        this.message = null;

        this._setProperties(values);
    }
}

// Register and export class
AmjsDataTypesObject.register('AmjsApiParserTypeItemError', AmjsApiParserTypeItemError);
module.exports = AmjsApiParserTypeItemError;