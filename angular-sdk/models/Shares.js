"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shares = (function () {
    function Shares(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `Shares`.
     */
    Shares.getModelName = function () {
        return "Shares";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of Shares for dynamic purposes.
    **/
    Shares.factory = function (data) {
        return new Shares(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    Shares.getModelDefinition = function () {
        return {
            name: 'Shares',
            plural: 'shares',
            properties: {
                "number_of_shares": {
                    name: 'number_of_shares',
                    type: 'number'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "sharetype_id": {
                    name: 'sharetype_id',
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
                "shareholder_id": {
                    name: 'shareholder_id',
                    type: 'number'
                },
            },
            relations: {
                ShareType: {
                    name: 'ShareType',
                    type: 'ShareType',
                    model: 'ShareType'
                },
                Shareholder: {
                    name: 'Shareholder',
                    type: 'Shareholder',
                    model: 'Shareholder'
                },
            }
        };
    };
    return Shares;
}());
exports.Shares = Shares;
