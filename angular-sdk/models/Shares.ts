/* tslint:disable */
import {
  ShareType,
  Shareholder
} from '../index';

declare var Object: any;
export interface SharesInterface {
  "number_of_shares"?: number;
  "id"?: number;
  "sharetype_id"?: number;
  "createdAt": Date;
  "updatedAt": Date;
  "shareholder_id"?: number;
  ShareType?: ShareType;
  Shareholder?: Shareholder;
}

export class Shares implements SharesInterface {
  "number_of_shares": number;
  "id": number;
  "sharetype_id": number;
  "createdAt": Date;
  "updatedAt": Date;
  "shareholder_id": number;
  ShareType: ShareType;
  Shareholder: Shareholder;
  constructor(data?: SharesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Shares`.
   */
  public static getModelName() {
    return "Shares";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Shares for dynamic purposes.
  **/
  public static factory(data: SharesInterface): Shares{
    return new Shares(data);
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
    }
  }
}
