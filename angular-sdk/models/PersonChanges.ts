/* tslint:disable */
import {
  Person,
  Company
} from '../index';

declare var Object: any;
export interface PersonChangesInterface {
  "key": string;
  "value": string;
  "date_modified": Date;
  "id"?: number;
  "personId"?: number;
  "companyId"?: number;
  Person?: Person;
  Company?: Company;
}

export class PersonChanges implements PersonChangesInterface {
  "key": string;
  "value": string;
  "date_modified": Date;
  "id": number;
  "personId": number;
  "companyId": number;
  Person: Person;
  Company: Company;
  constructor(data?: PersonChangesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PersonChanges`.
   */
  public static getModelName() {
    return "PersonChanges";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PersonChanges for dynamic purposes.
  **/
  public static factory(data: PersonChangesInterface): PersonChanges{
    return new PersonChanges(data);
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
      name: 'PersonChanges',
      plural: 'PersonChanges',
      properties: {
        "key": {
          name: 'key',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'string'
        },
        "date_modified": {
          name: 'date_modified',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "personId": {
          name: 'personId',
          type: 'number'
        },
        "companyId": {
          name: 'companyId',
          type: 'number'
        },
      },
      relations: {
        Person: {
          name: 'Person',
          type: 'Person',
          model: 'Person'
        },
        Company: {
          name: 'Company',
          type: 'Company',
          model: 'Company'
        },
      }
    }
  }
}
