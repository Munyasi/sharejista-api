"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Person = (function () {
    function Person(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `Person`.
     */
    Person.getModelName = function () {
        return "Person";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of Person for dynamic purposes.
    **/
    Person.factory = function (data) {
        return new Person(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    Person.getModelDefinition = function () {
        return {
            name: 'Person',
            plural: 'persons',
            properties: {
                "surname": {
                    name: 'surname',
                    type: 'string'
                },
                "other_names": {
                    name: 'other_names',
                    type: 'string'
                },
                "former_names": {
                    name: 'former_names',
                    type: 'string'
                },
                "nationality": {
                    name: 'nationality',
                    type: 'string'
                },
                "salutation": {
                    name: 'salutation',
                    type: 'string'
                },
                "email_address": {
                    name: 'email_address',
                    type: 'string'
                },
                "area_code": {
                    name: 'area_code',
                    type: 'string'
                },
                "phone_number": {
                    name: 'phone_number',
                    type: 'number'
                },
                "id_number": {
                    name: 'id_number',
                    type: 'string'
                },
                "occupation": {
                    name: 'occupation',
                    type: 'string'
                },
                "kra_pin": {
                    name: 'kra_pin',
                    type: 'string'
                },
                "date_of_birth": {
                    name: 'date_of_birth',
                    type: 'Date'
                },
                "box": {
                    name: 'box',
                    type: 'string'
                },
                "postal_code": {
                    name: 'postal_code',
                    type: 'string'
                },
                "appointment_date": {
                    name: 'appointment_date',
                    type: 'Date'
                },
                "resignation_date": {
                    name: 'resignation_date',
                    type: 'Date'
                },
                "person_type": {
                    name: 'person_type',
                    type: 'string'
                },
                "town": {
                    name: 'town',
                    type: 'string'
                },
                "street": {
                    name: 'street',
                    type: 'string'
                },
                "house_number": {
                    name: 'house_number',
                    type: 'string'
                },
                "building_name": {
                    name: 'building_name',
                    type: 'string'
                },
                "estate": {
                    name: 'estate',
                    type: 'string'
                },
                "profile_photo": {
                    name: 'profile_photo',
                    type: 'string'
                },
                "parent_id": {
                    name: 'parent_id',
                    type: 'number',
                    default: 0
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "company_id": {
                    name: 'company_id',
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
    return Person;
}());
exports.Person = Person;
