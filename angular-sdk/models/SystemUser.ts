/* tslint:disable */

declare var Object: any;
export interface SystemUserInterface {
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: number;
  accessTokens?: any[];
}

export class SystemUser implements SystemUserInterface {
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": number;
  accessTokens: any[];
  constructor(data?: SystemUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SystemUser`.
   */
  public static getModelName() {
    return "SystemUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SystemUser for dynamic purposes.
  **/
  public static factory(data: SystemUserInterface): SystemUser{
    return new SystemUser(data);
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
      name: 'SystemUser',
      plural: 'systemusers',
      properties: {
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: ''
        },
      }
    }
  }
}
