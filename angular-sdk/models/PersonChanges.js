"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PersonChanges = (function () {
    function PersonChanges(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `PersonChanges`.
     */
    PersonChanges.getModelName = function () {
        return "PersonChanges";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of PersonChanges for dynamic purposes.
    **/
    PersonChanges.factory = function (data) {
        return new PersonChanges(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    PersonChanges.getModelDefinition = function () {
        return {
            name: 'PersonChanges',
            plural: 'PersonChanges',
            properties: {
                "key": {
                    name: 'key',
                    type: 'string'
                },
                "value": {
                    name: 'value',
                    type: 'string'
                },
                "date_modified": {
                    name: 'date_modified',
                    type: 'Date'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
                "personId": {
                    name: 'personId',
                    type: 'number'
                },
                "companyId": {
                    name: 'companyId',
                    type: 'number'
                },
            },
            relations: {
                Person: {
                    name: 'Person',
                    type: 'Person',
                    model: 'Person'
                },
                Company: {
                    name: 'Company',
                    type: 'Company',
                    model: 'Company'
                },
            }
        };
    };
    return PersonChanges;
}());
exports.PersonChanges = PersonChanges;
