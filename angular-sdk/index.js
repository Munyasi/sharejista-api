"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
var search_params_1 = require("./services/core/search.params");
var error_service_1 = require("./services/core/error.service");
var auth_service_1 = require("./services/core/auth.service");
var logger_service_1 = require("./services/custom/logger.service");
var SDKModels_1 = require("./services/custom/SDKModels");
var storage_swaps_1 = require("./storage/storage.swaps");
var http_1 = require("@angular/http");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var cookie_browser_1 = require("./storage/cookie.browser");
var storage_browser_1 = require("./storage/storage.browser");
var socket_browser_1 = require("./sockets/socket.browser");
var socket_driver_1 = require("./sockets/socket.driver");
var socket_connections_1 = require("./sockets/socket.connections");
var real_time_1 = require("./services/core/real.time");
var User_1 = require("./services/custom/User");
var Company_1 = require("./services/custom/Company");
var CompanyType_1 = require("./services/custom/CompanyType");
var ShareType_1 = require("./services/custom/ShareType");
var Person_1 = require("./services/custom/Person");
var Shares_1 = require("./services/custom/Shares");
var ShareTransfer_1 = require("./services/custom/ShareTransfer");
var SystemUser_1 = require("./services/custom/SystemUser");
var Shareholder_1 = require("./services/custom/Shareholder");
var Output_1 = require("./services/custom/Output");
var PersonChanges_1 = require("./services/custom/PersonChanges");
var CR7_1 = require("./services/custom/CR7");
var CompanyShare_1 = require("./services/custom/CompanyShare");
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
var SDKBrowserModule = SDKBrowserModule_1 = (function () {
    function SDKBrowserModule() {
    }
    SDKBrowserModule.forRoot = function (internalStorageProvider) {
        if (internalStorageProvider === void 0) { internalStorageProvider = {
            provide: storage_swaps_1.InternalStorage,
            useClass: cookie_browser_1.CookieBrowser
        }; }
        return {
            ngModule: SDKBrowserModule_1,
            providers: [
                auth_service_1.LoopBackAuth,
                logger_service_1.LoggerService,
                search_params_1.JSONSearchParams,
                SDKModels_1.SDKModels,
                real_time_1.RealTime,
                User_1.UserApi,
                Company_1.CompanyApi,
                CompanyType_1.CompanyTypeApi,
                ShareType_1.ShareTypeApi,
                Person_1.PersonApi,
                Shares_1.SharesApi,
                ShareTransfer_1.ShareTransferApi,
                SystemUser_1.SystemUserApi,
                Shareholder_1.ShareholderApi,
                Output_1.OutputApi,
                PersonChanges_1.PersonChangesApi,
                CR7_1.CR7Api,
                CompanyShare_1.CompanyShareApi,
                internalStorageProvider,
                { provide: storage_swaps_1.SDKStorage, useClass: storage_browser_1.StorageBrowser },
                { provide: socket_driver_1.SocketDriver, useClass: socket_browser_1.SocketBrowser }
            ]
        };
    };
    return SDKBrowserModule;
}());
SDKBrowserModule = SDKBrowserModule_1 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, http_1.HttpModule],
        declarations: [],
        exports: [],
        providers: [
            error_service_1.ErrorHandler,
            socket_connections_1.SocketConnection
        ]
    })
], SDKBrowserModule);
exports.SDKBrowserModule = SDKBrowserModule;
/**
* Have Fun!!!
* - Jon
**/
__export(require("./models/index"));
__export(require("./services/index"));
__export(require("./lb.config"));
__export(require("./storage/storage.swaps"));
var cookie_browser_2 = require("./storage/cookie.browser");
exports.CookieBrowser = cookie_browser_2.CookieBrowser;
var storage_browser_2 = require("./storage/storage.browser");
exports.StorageBrowser = storage_browser_2.StorageBrowser;
var SDKBrowserModule_1;
