/* tslint:disable */

declare var Object: any;
export interface SharesInterface {
  "name"?: string;
  "id"?: number;
}

export class Shares implements SharesInterface {
  "name": string;
  "id": number;
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
