/* tslint:disable */
import {
  Company
} from '../index';

declare var Object: any;
export interface CR7Interface {
  "name": string;
  "from": Date;
  "to": Date;
  "date": Date;
  "id"?: number;
  "companyId"?: number;
  "createdAt": Date;
  "updatedAt": Date;
  Company?: Company;
}

export class CR7 implements CR7Interface {
  "name": string;
  "from": Date;
  "to": Date;
  "date": Date;
  "id": number;
  "companyId": number;
  "createdAt": Date;
  "updatedAt": Date;
  Company: Company;
  constructor(data?: CR7Interface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CR7`.
   */
  public static getModelName() {
    return "CR7";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CR7 for dynamic purposes.
  **/
  public static factory(data: CR7Interface): CR7{
    return new CR7(data);
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
      name: 'CR7',
      plural: 'CR7s',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "from": {
          name: 'from',
          type: 'Date'
        },
        "to": {
          name: 'to',
          type: 'Date'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "companyId": {
          name: 'companyId',
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
    }
  }
}
