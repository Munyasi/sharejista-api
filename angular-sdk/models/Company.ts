/* tslint:disable */

declare var Object: any;
export interface CompanyInterface {
  "company_name": string;
  "company_type": string;
  "registration_no": string;
  "employee_count": number;
  "primary_activity": string;
  "incorporation_date": Date;
  "accounting_start_period": Date;
  "accounting_end_period": Date;
  "town": string;
  "street": string;
  "name_of_building": string;
  "floor_room_no": string;
  "region": string;
  "box": string;
  "postal_code"?: string;
  "office_telephone_no": string;
  "mobile_no": string;
  "email_address": string;
  "company_share_capital": number;
  "number_of_shares": number;
  "remaining_shares": number;
  "current"?: number;
  "id"?: number;
}

export class Company implements CompanyInterface {
  "company_name": string;
  "company_type": string;
  "registration_no": string;
  "employee_count": number;
  "primary_activity": string;
  "incorporation_date": Date;
  "accounting_start_period": Date;
  "accounting_end_period": Date;
  "town": string;
  "street": string;
  "name_of_building": string;
  "floor_room_no": string;
  "region": string;
  "box": string;
  "postal_code": string;
  "office_telephone_no": string;
  "mobile_no": string;
  "email_address": string;
  "company_share_capital": number;
  "number_of_shares": number;
  "remaining_shares": number;
  "current": number;
  "id": number;
  constructor(data?: CompanyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public static getModelName() {
    return "Company";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Company for dynamic purposes.
  **/
  public static factory(data: CompanyInterface): Company{
    return new Company(data);
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
      name: 'Company',
      plural: 'companies',
      properties: {
        "company_name": {
          name: 'company_name',
          type: 'string'
        },
        "company_type": {
          name: 'company_type',
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
      },
      relations: {
      }
    }
  }
}
