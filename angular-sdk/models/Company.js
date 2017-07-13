"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Company = (function () {
    function Company(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `Company`.
     */
    Company.getModelName = function () {
        return "Company";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of Company for dynamic purposes.
    **/
    Company.factory = function (data) {
        return new Company(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    Company.getModelDefinition = function () {
        return {
            name: 'Company',
            plural: 'companies',
            properties: {
                "company_name": {
                    name: 'company_name',
                    type: 'string'
                },
                "registration_no": {
                    name: 'registration_no',
                    type: 'string'
                },
                "employee_count": {
                    name: 'employee_count',
                    type: 'number'
                },
                "primary_activity": {
                    name: 'primary_activity',
                    type: 'string'
                },
                "incorporation_date": {
                    name: 'incorporation_date',
                    type: 'Date'
                },
                "accounting_start_period": {
                    name: 'accounting_start_period',
                    type: 'Date'
                },
                "accounting_end_period": {
                    name: 'accounting_end_period',
                    type: 'Date'
                },
                "town": {
                    name: 'town',
                    type: 'string'
                },
                "street": {
                    name: 'street',
                    type: 'string'
                },
                "name_of_building": {
                    name: 'name_of_building',
                    type: 'string'
                },
                "floor_room_no": {
                    name: 'floor_room_no',
                    type: 'string'
                },
                "region": {
                    name: 'region',
                    type: 'string'
                },
                "box": {
                    name: 'box',
                    type: 'string'
                },
                "postal_code": {
                    name: 'postal_code',
                    type: 'string'
                },
                "office_telephone_no": {
                    name: 'office_telephone_no',
                    type: 'string'
                },
                "mobile_no": {
                    name: 'mobile_no',
                    type: 'string'
                },
                "email_address": {
                    name: 'email_address',
                    type: 'string'
                },
                "company_share_capital": {
                    name: 'company_share_capital',
                    type: 'number'
                },
                "number_of_shares": {
                    name: 'number_of_shares',
                    type: 'number'
                },
                "remaining_shares": {
                    name: 'remaining_shares',
                    type: 'number'
                },
                "current": {
                    name: 'current',
                    type: 'number'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "company_type_id": {
                    name: 'company_type_id',
                    type: 'number'
                },
            },
            relations: {
                CompanyType: {
                    name: 'CompanyType',
                    type: 'CompanyType',
                    model: 'CompanyType'
                },
            }
        };
    };
    return Company;
}());
exports.Company = Company;
