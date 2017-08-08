/* tslint:disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompanyType = (function () {
    function CompanyType(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `CompanyType`.
     */
    CompanyType.getModelName = function () {
        return "CompanyType";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of CompanyType for dynamic purposes.
    **/
    CompanyType.factory = function (data) {
        return new CompanyType(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    CompanyType.getModelDefinition = function () {
        return {
            name: 'CompanyType',
            plural: 'companytypes',
            properties: {
                "name": {
                    name: 'name',
                    type: 'string'
                },
                "id": {
                    name: 'id',
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
            relations: {}
        };
    };
    return CompanyType;
}());
exports.CompanyType = CompanyType;
