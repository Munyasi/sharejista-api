/* tslint:disable */
import {
  Company
} from '../index';

declare var Object: any;
export interface ShareTypeInterface {
  "name": string;
  "description"?: string;
  "transferrable"?: number;
  "id"?: number;
  "company_id"?: number;
  Company?: Company;
}

export class ShareType implements ShareTypeInterface {
  "name": string;
  "description": string;
  "transferrable": number;
  "id": number;
  "company_id": number;
  Company: Company;
  constructor(data?: ShareTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ShareType`.
   */
  public static getModelName() {
    return "ShareType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ShareType for dynamic purposes.
  **/
  public static factory(data: ShareTypeInterface): ShareType{
    return new ShareType(data);
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
      name: 'ShareType',
      plural: 'sharetypes',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "transferrable": {
          name: 'transferrable',
          type: 'number'
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
    }
  }
}
