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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var TodoService = (function () {
    function TodoService(_http) {
        this._http = _http;
        //private baseUrl = 'https://nabsdemo.herokuapp.com/result';
        this.baseUrlUsers = 'https://nabsdemo.herokuapp.com/users';
        this.users = new BehaviorSubject_1.BehaviorSubject([]);
        this.users$ = this.users.asObservable();
        this.selectedUser = new BehaviorSubject_1.BehaviorSubject(null);
        this.selectedUser$ = this.selectedUser.asObservable();
        this.selectedImage = new BehaviorSubject_1.BehaviorSubject(0);
        this.selectedImage$ = this.selectedImage.asObservable();
    }
    TodoService.prototype.addUsers = function (users) {
        this.users.next(users);
    };
    TodoService.prototype.setSelectedUser = function (selUser) {
        this.selectedUser.next(selUser);
    };
    TodoService.prototype.setSelectedImage = function (selImage) {
        this.selectedImage.next(selImage);
    };
    TodoService.prototype.getUsers = function () {
        return this._http.get(this.baseUrlUsers)
            .map(function (r) { return r.json(); });
    };
    return TodoService;
}());
TodoService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __metadata("design:paramtypes", [http_1.Http])
], TodoService);
exports.TodoService = TodoService;
