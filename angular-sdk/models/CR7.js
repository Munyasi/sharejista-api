"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CR7 = (function () {
    function CR7(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `CR7`.
     */
    CR7.getModelName = function () {
        return "CR7";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of CR7 for dynamic purposes.
    **/
    CR7.factory = function (data) {
        return new CR7(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    CR7.getModelDefinition = function () {
        return {
            name: 'CR7',
            plural: 'CR7s',
            properties: {
                "name": {
                    name: 'name',
                    type: 'string'
                },
                "from": {
                    name: 'from',
                    type: 'Date'
                },
                "to": {
                    name: 'to',
                    type: 'Date'
                },
                "date": {
                    name: 'date',
                    type: 'Date'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "companyId": {
                    name: 'companyId',
                    type: 'number'
                },
                "createdAt": {
                    name: 'createdAt',
                    type: 'Date'
                },
                "updatedAt": {
                    name: 'updatedAt',
                    type: 'Date'
                },
            },
            relations: {
                Company: {
                    name: 'Company',
                    type: 'Company',
                    model: 'Company'
                },
            }
        };
    };
    return CR7;
}());
exports.CR7 = CR7;
