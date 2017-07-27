/* tslint:disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SystemUser = (function () {
    function SystemUser(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `SystemUser`.
     */
    SystemUser.getModelName = function () {
        return "SystemUser";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of SystemUser for dynamic purposes.
    **/
    SystemUser.factory = function (data) {
        return new SystemUser(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    SystemUser.getModelDefinition = function () {
        return {
            name: 'SystemUser',
            plural: 'systemusers',
            properties: {
                "realm": {
                    name: 'realm',
                    type: 'string'
                },
                "username": {
                    name: 'username',
                    type: 'string'
                },
                "email": {
                    name: 'email',
                    type: 'string'
                },
                "emailVerified": {
                    name: 'emailVerified',
                    type: 'boolean'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
            },
            relations: {
                accessTokens: {
                    name: 'accessTokens',
                    type: 'any[]',
                    model: ''
                },
            }
        };
    };
    return SystemUser;
}());
exports.SystemUser = SystemUser;
