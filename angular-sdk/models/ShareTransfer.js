/* tslint:disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShareTransfer = (function () {
    function ShareTransfer(data) {
        Object.assign(this, data);
    }
    /**
     * The name of the model represented by this $resource,
     * i.e. `ShareTransfer`.
     */
    ShareTransfer.getModelName = function () {
        return "ShareTransfer";
    };
    /**
    * @method factory
    * @author Jonathan Casarrubias
    * @license MIT
    * This method creates an instance of ShareTransfer for dynamic purposes.
    **/
    ShareTransfer.factory = function (data) {
        return new ShareTransfer(data);
    };
    /**
    * @method getModelDefinition
    * @author Julien Ledun
    * @license MIT
    * This method returns an object that represents some of the model
    * definitions.
    **/
    ShareTransfer.getModelDefinition = function () {
        return {
            name: 'ShareTransfer',
            plural: 'sharetransfers',
            properties: {
                "transferer_id": {
                    name: 'transferer_id',
                    type: 'number'
                },
                "transferee_id": {
                    name: 'transferee_id',
                    type: 'number'
                },
                "transfer_type": {
                    name: 'transfer_type',
                    type: 'number'
                },
                "company_id": {
                    name: 'company_id',
                    type: 'number'
                },
                "number_of_shares": {
                    name: 'number_of_shares',
                    type: 'number'
                },
                "share_type_id": {
                    name: 'share_type_id',
                    type: 'number'
                },
                "approved": {
                    name: 'approved',
                    type: 'boolean'
                },
                "initiated_by": {
                    name: 'initiated_by',
                    type: 'number'
                },
                "approved_by": {
                    name: 'approved_by',
                    type: 'number'
                },
                "id": {
                    name: 'id',
                    type: 'number'
                },
            },
            relations: {}
        };
    };
    return ShareTransfer;
}());
exports.ShareTransfer = ShareTransfer;
