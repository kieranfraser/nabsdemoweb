"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var TodoService = (function () {
    function TodoService() {
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
    return TodoService;
}());
TodoService = __decorate([
    core_1.Injectable()
], TodoService);
exports.TodoService = TodoService;
