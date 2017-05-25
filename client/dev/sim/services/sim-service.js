"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var SimService = (function () {
    function SimService(_http) {
        this._http = _http;
        //private baseUrl = 'https://nabsdemo.herokuapp.com/result';
        this.base = 'https://nabsdemo.herokuapp.com';
        this.baseLocal = 'http://localhost:8080';
        this.baseUrlResult = this.baseLocal + '/result';
        this.baseUrlParams = this.baseLocal + '/params';
        this.baseUrlResultParams = this.baseLocal + '/resultparams';
        this.baseUrlResultChangeDelivery = this.baseLocal + '/resultforchangedelivery';
        this.baseUrlNotifEvents = this.baseLocal + '/notificationevents';
        this.baseUrlBeginConvo = this.baseLocal + '/beginconvo';
        this.baseUrlContinueConvo = this.baseLocal + '/continueconvo';
    }
    SimService.prototype.getResults = function (userId) {
        return this._http.get(this.baseUrlResult + "?user=" + userId + "&notifId=something")
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.getResultWithAlertParams = function (userId, alertParams) {
        return this._http.get(this.baseUrlResultParams + "?user=" + userId + "&params=" + alertParams)
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.getResultForChangeDelivery = function (userId, notificationId, alertParams, notificationFeature, ranking) {
        return this._http.get(this.baseUrlResultChangeDelivery + "?user=" + userId + "&notificationId=" + notificationId
            + "&ruleParams=" + alertParams + "&notificationFeature=" + notificationFeature + "&ranking=" + ranking)
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.getDefaultAlertParams = function () {
        return this._http.get(this.baseUrlParams + "?type=alert")
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.getNotificationEvents = function (userId, date) {
        return this._http.get(this.baseUrlNotifEvents + "?user=" + userId + "&date=" + date)
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.beginConvoRequest = function () {
        return this._http.get(this.baseUrlBeginConvo)
            .map(function (r) { return r.json(); });
    };
    SimService.prototype.continueConvoRequest = function (input, context) {
        return this._http.post(this.baseUrlContinueConvo + "?input=" + input, JSON.stringify(context))
            .map(function (r) { return r.json(); });
    };
    return SimService;
}());
SimService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __metadata("design:paramtypes", [http_1.Http])
], SimService);
exports.SimService = SimService;
