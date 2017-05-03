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
var angularfire2_1 = require("angularfire2");
require("rxjs/add/operator/take");
var todo_service_1 = require("../../todo/services/todo-service");
var router_1 = require("@angular/router");
var HomeCmp = (function () {
    function HomeCmp(af, todoService, router) {
        this.af = af;
        this.todoService = todoService;
        this.router = router;
        this.title = "NAbs";
        this.selectedUser = null;
        this.selectedNotification = null;
        this.selectedImage = null;
    }
    HomeCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.todoService.users$.subscribe(function (users) {
            _this.users = users;
            if (_this.users.length == 0) {
                _this.isRequesting = true;
                /*this.af.database.list("web/users/").subscribe(data=>{
                  for(var val of data){
                    this.users.push(val);
                  }
                  this.todoService.addUsers(this.users);
                  this.isRequesting = false;
                });*/
                _this.todoService
                    .getUsers()
                    .subscribe(function (users) {
                    _this.users = users;
                });
            }
        });
    };
    HomeCmp.prototype.selectUser = function (user, index) {
        this.selectedUser = user;
        this.selectedImage = index;
        this.todoService.setSelectedUser(user);
        this.todoService.setSelectedImage(index);
    };
    HomeCmp.prototype.notificationSelected = function (notification) {
        this.selectedNotification = notification;
    };
    return HomeCmp;
}());
HomeCmp = __decorate([
    core_1.Component({
        selector: "home-cmp",
        templateUrl: "home/templates/home.html",
        styleUrls: ["home/styles/home.css"]
    }),
    __metadata("design:paramtypes", [angularfire2_1.AngularFire, todo_service_1.TodoService, router_1.Router])
], HomeCmp);
exports.HomeCmp = HomeCmp;
