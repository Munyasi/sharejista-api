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
 * Api services for the `Output` model.
 */
var OutputApi = (function (_super) {
    __extends(OutputApi, _super);
    function OutputApi(http, connection, models, auth, searchParams, errorHandler) {
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
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @returns {object[]} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Output` object.)
     * </em>
     */
    OutputApi.prototype.getContainers = function (customHeaders) {
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs";
        var _routeParams = {};
        var _postBody = {};
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
     * This method expects a subset of model properties as request parameters.
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Output` object.)
     * </em>
     */
    OutputApi.prototype.createContainer = function (options, customHeaders) {
        if (options === void 0) { options = {}; }
        var _method = "POST";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs";
        var _routeParams = {};
        var _postBody = {
            options: options
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
     * @param {string} container
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `` – `{}` -
     */
    OutputApi.prototype.destroyContainer = function (container, customHeaders) {
        if (container === void 0) { container = {}; }
        var _method = "DELETE";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container";
        var _routeParams = {
            container: container
        };
        var _postBody = {};
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {string} container
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Output` object.)
     * </em>
     */
    OutputApi.prototype.getContainer = function (container, customHeaders) {
        if (container === void 0) { container = {}; }
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container";
        var _routeParams = {
            container: container
        };
        var _postBody = {};
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {string} container
     *
     * @returns {object[]} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Output` object.)
     * </em>
     */
    OutputApi.prototype.getFiles = function (container, customHeaders) {
        if (container === void 0) { container = {}; }
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container/files";
        var _routeParams = {
            container: container
        };
        var _postBody = {};
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {string} container
     *
     * @param {string} file
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Output` object.)
     * </em>
     */
    OutputApi.prototype.getFile = function (container, file, customHeaders) {
        if (container === void 0) { container = {}; }
        if (file === void 0) { file = {}; }
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container/files/:file";
        var _routeParams = {
            container: container,
            file: file
        };
        var _postBody = {};
        var _urlParams = {};
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {string} container
     *
     * @param {string} file
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `` – `{}` -
     */
    OutputApi.prototype.removeFile = function (container, file, customHeaders) {
        if (container === void 0) { container = {}; }
        if (file === void 0) { file = {}; }
        var _method = "DELETE";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container/files/:file";
        var _routeParams = {
            container: container,
            file: file
        };
        var _postBody = {};
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
     *  - `req` – `{object}` -
     *
     *  - `res` – `{object}` -
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `result` – `{object}` -
     */
    OutputApi.prototype.upload = function (req, res, customHeaders) {
        if (req === void 0) { req = {}; }
        if (res === void 0) { res = {}; }
        var _method = "POST";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container/upload";
        var _routeParams = {};
        var _postBody = {};
        var _urlParams = {};
        if (typeof req !== 'undefined' && req !== null)
            _urlParams.req = req;
        if (typeof res !== 'undefined' && res !== null)
            _urlParams.res = res;
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * <em>
           * (The remote method definition does not provide any description.)
           * </em>
     *
     * @param {string} container
     *
     * @param {string} file
     *
     * @param {object} req
     *
     * @param {object} res
     *
     * @returns {object} An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    OutputApi.prototype.download = function (container, file, req, res, customHeaders) {
        if (container === void 0) { container = {}; }
        if (file === void 0) { file = {}; }
        if (req === void 0) { req = {}; }
        if (res === void 0) { res = {}; }
        var _method = "GET";
        var _url = lb_config_1.LoopBackConfig.getPath() + "/" + lb_config_1.LoopBackConfig.getApiVersion() +
            "/outputs/:container/download/:file";
        var _routeParams = {
            container: container,
            file: file
        };
        var _postBody = {};
        var _urlParams = {};
        if (typeof req !== 'undefined' && req !== null)
            _urlParams.req = req;
        if (typeof res !== 'undefined' && res !== null)
            _urlParams.res = res;
        var result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
        return result;
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `Output`.
     */
    OutputApi.prototype.getModelName = function () {
        return "Output";
    };
    return OutputApi;
}(base_service_1.BaseLoopBackApi));
OutputApi = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __param(1, core_1.Inject(socket_connections_1.SocketConnection)),
    __param(2, core_1.Inject(SDKModels_1.SDKModels)),
    __param(3, core_1.Inject(auth_service_1.LoopBackAuth)),
    __param(4, core_1.Inject(search_params_1.JSONSearchParams)),
    __param(5, core_1.Optional()), __param(5, core_1.Inject(error_service_1.ErrorHandler))
], OutputApi);
exports.OutputApi = OutputApi;
