"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var SDKModels_1 = require("./SDKModels");
var base_service_1 = require("../core/base.service");
var lb_config_1 = require("../../lb.config");
var auth_service_1 = require("../core/auth.service");
var search_params_1 = require("../core/search.params");
var error_service_1 = require("../core/error.service");
var socket_connections_1 = require("../../sockets/socket.connections");
/**
 * Api services for the `CR7` model.
 */
var CR7Api = (function (_super) {
    __extends(CR7Api, _super);
    function CR7Api(http, connection, models, auth, searchParams, errorHandler) {
        var _this = _super.call(this, http, connection, models, auth, searchParams, errorHandler) || this;
        _this.http = http;
        _this.connection = connection;
        _this.models = models;
        _this.auth = auth;
        _this.searchParams = searchParams;
        _this.errorHandler = errorHandler;
        return _this;
    }
    /**
     * Fetches belongsTo relation Company.
     *
     * @param {any} id CR7 id
     *
     * @param {boolean} refresh
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `CR7` object.)
     * </em>
     */
    CR7Api.prototype.getCompany = function (id, refresh, customHeaders) {
        if (refresh === void 0) { refresh = {}; }
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/CR7s/:id/Company";
        var _routeParams = {
            id: id
        };
        var _postBody = {};
        var _urlParams = {};
        if (typeof refresh !== 'undefined' && refresh !== null)
            _urlParams.refresh = refresh;
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * Patch an existing model instance or insert a new one into the data source.
     *
     * @param {object} data Request data.
     *
     *  - `data` – `{object}` - Model instance data
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `CR7` object.)
     * </em>
     */
    CR7Api.prototype.patchOrCreate = function (data, customHeaders) {
        if (data === void 0) { data = {}; }
        var _method = "PATCH";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/CR7s";
        var _routeParams = {};
        var _postBody = {
            data: data
        };
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * Patch attributes for a model instance and persist it into the data source.
     *
     * @param {any} id CR7 id
     *
     * @param {object} data Request data.
     *
     *  - `data` – `{object}` - An object of model property name/value pairs
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `CR7` object.)
     * </em>
     */
    CR7Api.prototype.patchAttributes = function (id, data, customHeaders) {
        if (data === void 0) { data = {}; }
        var _method = "PATCH";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/CR7s/:id";
        var _routeParams = {
            id: id
        };
        var _postBody = {
            data: data
        };
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {object} data Request data.
     *
     *  - `companyId` – `{string}` -
     *
     *  - `from` – `{string}` -
     *
     *  - `to` – `{string}` -
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `data` – `{Object}` -
     */
    CR7Api.prototype.generateCR7 = function (companyId, from, to, customHeaders) {
        var _method = "POST";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/CR7s/generateCR7";
        var _routeParams = {};
        var _postBody = {};
        var _urlParams = {};
        if (typeof companyId !== 'undefined' && companyId !== null)
            _urlParams.companyId = companyId;
        if (typeof from !== 'undefined' && from !== null)
            _urlParams.from = from;
        if (typeof to !== 'undefined' && to !== null)
            _urlParams.to = to;
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {object} data Request data.
     *
     *  - `companyId` – `{string}` -
     *
     *  - `from` – `{string}` -
     *
     *  - `to` – `{string}` -
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `data` – `{Object}` -
     */
    CR7Api.prototype.generateCR8 = function (companyId, from, to, customHeaders) {
        var _method = "POST";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/CR7s/generateCR8";
        var _routeParams = {};
        var _postBody = {};
        var _urlParams = {};
        if (typeof companyId !== 'undefined' && companyId !== null)
            _urlParams.companyId = companyId;
        if (typeof from !== 'undefined' && from !== null)
            _urlParams.from = from;
        if (typeof to !== 'undefined' && to !== null)
            _urlParams.to = to;
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `CR7`.
     */
    CR7Api.prototype.getModelName = function () {
        return "CR7";
    };
    return CR7Api;
}(base_service_1.BaseLoopBackApi));
CR7Api = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __param(1, core_1.Inject(socket_connections_1.SocketConnection)),
    __param(2, core_1.Inject(SDKModels_1.SDKModels)),
    __param(3, core_1.Inject(auth_service_1.LoopBackAuth)),
    __param(4, core_1.Inject(search_params_1.JSONSearchParams)),
    __param(5, core_1.Optional()), __param(5, core_1.Inject(error_service_1.ErrorHandler))
], CR7Api);
exports.CR7Api = CR7Api;
