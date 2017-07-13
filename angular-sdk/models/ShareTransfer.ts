/* tslint:disable */

declare var Object: any;
export interface ShareTransferInterface {
  "transferer_id"?: number;
  "transferee_id": number;
  "transfer_type"?: number;
  "company_id": number;
  "number_of_shares": number;
  "share_type_id": number;
  "approved"?: boolean;
  "initiated_by"?: number;
  "approved_by"?: number;
  "id"?: number;
}

export class ShareTransfer implements ShareTransferInterface {
  "transferer_id": number;
  "transferee_id": number;
  "transfer_type": number;
  "company_id": number;
  "number_of_shares": number;
  "share_type_id": number;
  "approved": boolean;
  "initiated_by": number;
  "approved_by": number;
  "id": number;
  constructor(data?: ShareTransferInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ShareTransfer`.
   */
  public static getModelName() {
    return "ShareTransfer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ShareTransfer for dynamic purposes.
  **/
  public static factory(data: ShareTransferInterface): ShareTransfer{
    return new ShareTransfer(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
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
      relations: {
      }
    }
  }
}
