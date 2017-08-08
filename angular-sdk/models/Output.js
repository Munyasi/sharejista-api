/* tslint:disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Output = (function () {
    function Output(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `Output`.
     */
    Output.getModelName = function () {
        return "Output";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of Output for dynamic purposes.
    **/
    Output.factory = function (data) {
        return new Output(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    Output.getModelDefinition = function () {
        return {
            name: 'Output',
            plural: 'outputs',
            properties: {
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
    return Output;
}());
exports.Output = Output;
