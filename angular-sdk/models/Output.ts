/* tslint:disable */

declare var Object: any;
export interface OutputInterface {
  "id"?: number;
}

export class Output implements OutputInterface {
  "id": number;
  constructor(data?: OutputInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Output`.
   */
  public static getModelName() {
    return "Output";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Output for dynamic purposes.
  **/
  public static factory(data: OutputInterface): Output{
    return new Output(data);
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
      name: 'Output',
      plural: 'outputs',
      properties: {
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
