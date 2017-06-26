/* tslint:disable */

declare var Object: any;
export interface CompanyTypeInterface {
  "name": string;
  "id"?: number;
}

export class CompanyType implements CompanyTypeInterface {
  "name": string;
  "id": number;
  constructor(data?: CompanyTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CompanyType`.
   */
  public static getModelName() {
    return "CompanyType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CompanyType for dynamic purposes.
  **/
  public static factory(data: CompanyTypeInterface): CompanyType{
    return new CompanyType(data);
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
      name: 'CompanyType',
      plural: 'companytypes',
      properties: {
        "name": {
          name: 'name',
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
