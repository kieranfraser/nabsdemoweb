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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sim_service_1 = require("../services/sim-service");
var angularfire2_1 = require("angularfire2");
require("rxjs/add/operator/take");
var todo_service_1 = require("../../todo/services/todo-service");
var router_1 = require("@angular/router");
var SimCmp = (function () {
    function SimCmp(af, todoService, router, simService) {
        var _this = this;
        this.af = af;
        this.todoService = todoService;
        this.router = router;
        this.simService = simService;
        this.title = "NAbs";
        this.selectedUser = null;
        this.selectedImage = null;
        this.allResults = null;
        this.selectedUserEvents = null;
        this.alertParams = null;
        this.selectedNotification = null;
        this.selectedResult = null;
        this.alertSenderInputValues = ["NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP",
            "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT",
            "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP"];
        this.alertSubjectInputValues = ["NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP",
            "NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP",
            "NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP"];
        this.alertAppInputValues = ["NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP",
            "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP",
            "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP"];
        this.alertOptions = ["NOW", "VERYSOON", "SOON", "LATER", "MUCHLATER"];
        this.subscriptionOne = this.todoService.selectedUser$.subscribe(function (selectedUser) {
            _this.selectedUser = selectedUser;
            console.log("sel user");
        });
        this.subscriptionTwo = this.todoService.selectedImage$.subscribe(function (selectedImage) {
            _this.selectedImage = selectedImage;
            console.log("sel image");
            console.log(_this.selectedImage);
        });
    }
    SimCmp.prototype.ngOnInit = function () {
        var _this = this;
        console.log("init");
        if (this.selectedUser == null) {
            this.router.navigate(['../home']);
        }
        this.simService
            .getDefaultAlertParams()
            .subscribe(function (alertParams) {
            _this.alertParams = alertParams;
        });
    };
    SimCmp.prototype.notificationSelected = function (notification) {
        this.selectedNotification = notification;
    };
    SimCmp.prototype.fireAll = function () {
        var _this = this;
        this.simService
            .getResults(this.selectedUser.id)
            .subscribe(function (allResults) {
            _this.allResults = allResults;
        });
    };
    SimCmp.prototype.fireAllParams = function () {
        var _this = this;
        this.simService
            .getResultWithAlertParams(this.selectedUser.id, this.alertParams)
            .subscribe(function (allResults) {
            _this.allResults = allResults;
        });
    };
    SimCmp.prototype.setNotification = function (notification, result) {
        this.selectedNotification = notification;
        this.selectedResult = result;
    };
    SimCmp.prototype.trackByIndex = function (index, value) {
        return index;
    };
    SimCmp.prototype.checkAlertParams = function () {
        console.log(this.alertParams);
    };
    return SimCmp;
}());
SimCmp = __decorate([
    core_1.Component({
        selector: "sim-cmp",
        templateUrl: "sim/templates/sim.html",
        styleUrls: ["sim/styles/sim.css"]
    }),
    __metadata("design:paramtypes", [angularfire2_1.AngularFire, todo_service_1.TodoService, router_1.Router,
        sim_service_1.SimService])
], SimCmp);
exports.SimCmp = SimCmp;
