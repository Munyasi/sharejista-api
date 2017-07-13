"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shareholder = (function () {
    function Shareholder(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `Shareholder`.
     */
    Shareholder.getModelName = function () {
        return "Shareholder";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of Shareholder for dynamic purposes.
    **/
    Shareholder.factory = function (data) {
        return new Shareholder(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    Shareholder.getModelDefinition = function () {
        return {
            name: 'Shareholder',
            plural: 'shareholders',
            properties: {
                "type": {
                    name: 'type',
                    type: 'string'
                },
                "name": {
                    name: 'name',
                    type: 'string'
                },
                "email_address": {
                    name: 'email_address',
                    type: 'string'
                },
                "phone_number": {
                    name: 'phone_number',
                    type: 'string'
                },
                "id_reg_number": {
                    name: 'id_reg_number',
                    type: 'string'
                },
                "appointment_date": {
                    name: 'appointment_date',
                    type: 'Date'
                },
                "postal_code": {
                    name: 'postal_code',
                    type: 'string'
                },
                "box": {
                    name: 'box',
                    type: 'string'
                },
                "profile_photo": {
                    name: 'profile_photo',
                    type: 'string'
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
    return Shareholder;
}());
exports.Shareholder = Shareholder;
