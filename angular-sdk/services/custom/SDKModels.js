"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var core_1 = require("@angular/core");
var User_1 = require("../../models/User");
var Company_1 = require("../../models/Company");
var CompanyType_1 = require("../../models/CompanyType");
var ShareType_1 = require("../../models/ShareType");
var Person_1 = require("../../models/Person");
var Shares_1 = require("../../models/Shares");
var ShareTransfer_1 = require("../../models/ShareTransfer");
var SystemUser_1 = require("../../models/SystemUser");
var Shareholder_1 = require("../../models/Shareholder");
var Output_1 = require("../../models/Output");
var PersonChanges_1 = require("../../models/PersonChanges");
var CR7_1 = require("../../models/CR7");
var SDKModels = (function () {
    function SDKModels() {
        this.models = {
            User: User_1.User,
            Company: Company_1.Company,
            CompanyType: CompanyType_1.CompanyType,
            ShareType: ShareType_1.ShareType,
            Person: Person_1.Person,
            Shares: Shares_1.Shares,
            ShareTransfer: ShareTransfer_1.ShareTransfer,
            SystemUser: SystemUser_1.SystemUser,
            Shareholder: Shareholder_1.Shareholder,
            Output: Output_1.Output,
            PersonChanges: PersonChanges_1.PersonChanges,
            CR7: CR7_1.CR7,
        };
    }
    SDKModels.prototype.get = function (modelName) {
        return this.models[modelName];
    };
    SDKModels.prototype.getAll = function () {
        return this.models;
    };
    SDKModels.prototype.getModelNames = function () {
        return Object.keys(this.models);
    };
    return SDKModels;
}());
SDKModels = __decorate([
    core_1.Injectable()
], SDKModels);
exports.SDKModels = SDKModels;
