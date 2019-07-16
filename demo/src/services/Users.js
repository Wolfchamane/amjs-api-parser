// Required collections
require('../type/collection/Users');
// ---------------------------- /
const AmjsAjaxService = require('@amjs/ajax-service');

/**
* @NOTICE: DO NOT MODIFY THIS FILE, generated with '@amjs/api-parser'
* @created 2019-07-16T10:36:45.141Z
*
* List all users
* @namespace   amjs.api.parser.service
* @class       amjs.api.parser.service.Users
* @extends     amjs.ajax.Service
*/
class AmjsApiParserServiceUsers extends AmjsAjaxService
{
    /**
     * @override
     */
    constructor(values = {})
    {
        super();

        this.$allowedMethods = [
            'GET',
            'POST',
        ];

        values = Object.assign(values, {
            path   : '/users',
            method : 'GET'
        });

        this._setProperties(values);
    }

    /**
     * @override
     */
    _getModel(method = 'GET')
    {
        let model;
        switch (method)
        {
            case 'GET':
            default:
                model = 'Users';
                break;
        }

        return model;
    }
}

// Register & export service class
AmjsAjaxService.register('AmjsApiParserServiceUsers', AmjsApiParserServiceUsers);
module.exports = AmjsApiParserServiceUsers;