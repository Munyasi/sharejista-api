/* tslint:disable */

declare var Object: any;
export interface PersonInterface {
  "surname": string;
  "other_names": string;
  "salutation": string;
  "email_address": string;
  "phone_number": string;
  "id_number": string;
  "occupation": string;
  "kra_pin": string;
  "date_of_birth": Date;
  "former_name"?: string;
  "residential_address": string;
  "box": string;
  "postal_code": string;
  "appointment_allotment_date"?: Date;
  "resignation_date"?: Date;
  "person_type"?: string;
  "id"?: number;
}

export class Person implements PersonInterface {
  "surname": string;
  "other_names": string;
  "salutation": string;
  "email_address": string;
  "phone_number": string;
  "id_number": string;
  "occupation": string;
  "kra_pin": string;
  "date_of_birth": Date;
  "former_name": string;
  "residential_address": string;
  "box": string;
  "postal_code": string;
  "appointment_allotment_date": Date;
  "resignation_date": Date;
  "person_type": string;
  "id": number;
  constructor(data?: PersonInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Person`.
   */
  public static getModelName() {
    return "Person";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Person for dynamic purposes.
  **/
  public static factory(data: PersonInterface): Person{
    return new Person(data);
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
      name: 'Person',
      plural: 'persons',
      properties: {
        "surname": {
          name: 'surname',
          type: 'string'
        },
        "other_names": {
          name: 'other_names',
          type: 'string'
        },
        "salutation": {
          name: 'salutation',
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
        "id_number": {
          name: 'id_number',
          type: 'string'
        },
        "occupation": {
          name: 'occupation',
          type: 'string'
        },
        "kra_pin": {
          name: 'kra_pin',
          type: 'string'
        },
        "date_of_birth": {
          name: 'date_of_birth',
          type: 'Date'
        },
        "former_name": {
          name: 'former_name',
          type: 'string'
        },
        "residential_address": {
          name: 'residential_address',
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
        "appointment_allotment_date": {
          name: 'appointment_allotment_date',
          type: 'Date'
        },
        "resignation_date": {
          name: 'resignation_date',
          type: 'Date'
        },
        "person_type": {
          name: 'person_type',
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
