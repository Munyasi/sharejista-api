/* tslint:disable */

declare var Object: any;
export interface ShareTypeInterface {
  "name": string;
  "type"?: number;
  "description"?: string;
  "tranferrable"?: boolean;
  "can_be_director"?: boolean;
  "can_vote"?: boolean;
  "id"?: number;
}

export class ShareType implements ShareTypeInterface {
  "name": string;
  "type": number;
  "description": string;
  "tranferrable": boolean;
  "can_be_director": boolean;
  "can_vote": boolean;
  "id": number;
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
        "type": {
          name: 'type',
          type: 'number'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "tranferrable": {
          name: 'tranferrable',
          type: 'boolean'
        },
        "can_be_director": {
          name: 'can_be_director',
          type: 'boolean'
        },
        "can_vote": {
          name: 'can_vote',
          type: 'boolean'
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
