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
var http_1 = require("@angular/http");
/**
* @author Jonathan Casarrubias <twitter:@johncasarrubias> <github:@mean-expert-official>
* @module JSONSearchParams
* @license MIT
* @description
* JSON Parser and Wrapper for the Angular2 URLSearchParams
* This module correctly encodes a json object into a query string and then creates
* an instance of the URLSearchParams component for later use in HTTP Calls
**/
var JSONSearchParams = (function () {
    function JSONSearchParams() {
    }
    JSONSearchParams.prototype.setJSON = function (obj) {
        this._usp = new http_1.URLSearchParams(this._JSON2URL(obj, false));
    };
    JSONSearchParams.prototype.getURLSearchParams = function () {
        return this._usp;
    };
    JSONSearchParams.prototype._JSON2URL = function (obj, parent) {
        var parts = [];
        for (var key in obj)
            parts.push(this._parseParam(key, obj[key], parent));
        return parts.join('&');
    };
    JSONSearchParams.prototype._parseParam = function (key, value, parent) {
        var processedKey = parent ? parent + '[' + key + ']' : key;
        if (value && ((typeof value) === 'object' || Array.isArray(value))) {
            return this._JSON2URL(value, processedKey);
        }
        return processedKey + '=' + value;
    };
    return JSONSearchParams;
}());
JSONSearchParams = __decorate([
    core_1.Injectable()
], JSONSearchParams);
exports.JSONSearchParams = JSONSearchParams;
