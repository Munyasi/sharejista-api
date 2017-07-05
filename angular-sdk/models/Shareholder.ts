/* tslint:disable */

declare var Object: any;
export interface ShareholderInterface {
  "type": string;
  "name": string;
  "email_address": string;
  "phone_number": string;
  "id_reg_number": string;
  "appointment_date"?: Date;
  "postal_code": string;
  "box": string;
  "id"?: number;
}

export class Shareholder implements ShareholderInterface {
  "type": string;
  "name": string;
  "email_address": string;
  "phone_number": string;
  "id_reg_number": string;
  "appointment_date": Date;
  "postal_code": string;
  "box": string;
  "id": number;
  constructor(data?: ShareholderInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Shareholder`.
   */
  public static getModelName() {
    return "Shareholder";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Shareholder for dynamic purposes.
  **/
  public static factory(data: ShareholderInterface): Shareholder{
    return new Shareholder(data);
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
      name: 'Shareholder',
      plural: 'shareholders',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "email_address": {
          name: 'email_address',
          type: 'string'
        },
        "phone_number": {
          name: 'phone_number',
          type: 'string'
        },
        "id_reg_number": {
          name: 'id_reg_number',
          type: 'string'
        },
        "appointment_date": {
          name: 'appointment_date',
          type: 'Date'
        },
        "postal_code": {
          name: 'postal_code',
          type: 'string'
        },
        "box": {
          name: 'box',
          type: 'string'
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