"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module SocketDriver
 * @author Jonathan Casarrubias <t: johncasarrubias, gh: mean-expert-official>
 * @license MIT
 * @description
 * The SocketDriver class is used for dependency injection swapping.
 * It will be provided using factory method from different sources.
 **/
var SocketDriver = (function () {
    function SocketDriver() {
    }
    SocketDriver.prototype.connect = function (url, options) { };
    return SocketDriver;
}());
exports.SocketDriver = SocketDriver;