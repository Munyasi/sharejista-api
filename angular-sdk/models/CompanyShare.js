"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompanyShare = (function () {
    function CompanyShare(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `CompanyShare`.
     */
    CompanyShare.getModelName = function () {
        return "CompanyShare";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of CompanyShare for dynamic purposes.
    **/
    CompanyShare.factory = function (data) {
        return new CompanyShare(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    CompanyShare.getModelDefinition = function () {
        return {
            name: 'CompanyShare',
            plural: 'CompanyShares',
            properties: {
                "share_number": {
                    name: 'share_number',
                    type: 'number'
                },
                "unissued_shares": {
                    name: 'unissued_shares',
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
                "share_type_id": {
                    name: 'share_type_id',
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
                ShareType: {
                    name: 'ShareType',
                    type: 'ShareType',
                    model: 'ShareType'
                },
            }
        };
    };
    return CompanyShare;
}());
exports.CompanyShare = CompanyShare;
