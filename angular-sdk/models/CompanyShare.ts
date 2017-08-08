/* tslint:disable */
import {
  Company,
  ShareType
} from '../index';

declare var Object: any;
export interface CompanyShareInterface {
  "share_number": number;
  "unissued_shares": number;
  "id"?: number;
  "company_id"?: number;
  "share_type_id"?: number;
  "createdAt": Date;
  "updatedAt": Date;
  Company?: Company;
  ShareType?: ShareType;
}

export class CompanyShare implements CompanyShareInterface {
  "share_number": number;
  "unissued_shares": number;
  "id": number;
  "company_id": number;
  "share_type_id": number;
  "createdAt": Date;
  "updatedAt": Date;
  Company: Company;
  ShareType: ShareType;
  constructor(data?: CompanyShareInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CompanyShare`.
   */
  public static getModelName() {
    return "CompanyShare";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CompanyShare for dynamic purposes.
  **/
  public static factory(data: CompanyShareInterface): CompanyShare{
    return new CompanyShare(data);
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
      name: 'CompanyShare',
      plural: 'CompanyShares',
      properties: {
        "share_number": {
          name: 'share_number',
          type: 'number'
        },
        "unissued_shares": {
          name: 'unissued_shares',
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
        "share_type_id": {
          name: 'share_type_id',
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
        ShareType: {
          name: 'ShareType',
          type: 'ShareType',
          model: 'ShareType'
        },
      }
    }
  }
}
