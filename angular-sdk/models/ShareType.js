"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShareType = (function () {
    function ShareType(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `ShareType`.
     */
    ShareType.getModelName = function () {
        return "ShareType";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of ShareType for dynamic purposes.
    **/
    ShareType.factory = function (data) {
        return new ShareType(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    ShareType.getModelDefinition = function () {
        return {
            name: 'ShareType',
            plural: 'sharetypes',
            properties: {
                "name": {
                    name: 'name',
                    type: 'string'
                },
                "description": {
                    name: 'description',
                    type: 'string'
                },
                "transferrable": {
                    name: 'transferrable',
                    type: 'number'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "company_id": {
                    name: 'company_id',
                    type: 'number'
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
    return ShareType;
}());
exports.ShareType = ShareType;
