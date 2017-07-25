/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Company } from '../../models/Company';
import { CompanyType } from '../../models/CompanyType';
import { ShareType } from '../../models/ShareType';
import { Person } from '../../models/Person';
import { Shares } from '../../models/Shares';
import { ShareTransfer } from '../../models/ShareTransfer';
import { SystemUser } from '../../models/SystemUser';
import { Shareholder } from '../../models/Shareholder';
import { Output } from '../../models/Output';
import { PersonChanges } from '../../models/PersonChanges';
import { CR7 } from '../../models/CR7';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Company: Company,
    CompanyType: CompanyType,
    ShareType: ShareType,
    Person: Person,
    Shares: Shares,
    ShareTransfer: ShareTransfer,
    SystemUser: SystemUser,
    Shareholder: Shareholder,
    Output: Output,
    PersonChanges: PersonChanges,
    CR7: CR7,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
