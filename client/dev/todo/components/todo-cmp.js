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
var todo_service_1 = require("../services/todo-service");
var angularfire2_1 = require("angularfire2");
require("rxjs/add/operator/take");
var router_1 = require("@angular/router");
var TodoCmp = (function () {
    function TodoCmp(af, router, todoService) {
        var _this = this;
        this.router = router;
        this.todoService = todoService;
        this.title = "NAbs";
        this.users = [];
        this.isRequesting = true;
        af.database.list("web/users/").subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var val = data_1[_i];
                _this.users.push(val);
            }
            _this.todoService.addUsers(_this.users);
            _this.router.navigate(['/home']);
        });
    }
    TodoCmp.prototype.ngOnInit = function () { };
    return TodoCmp;
}());
TodoCmp = __decorate([
    core_1.Component({
        selector: "todo-cmp",
        templateUrl: "todo/templates/todo.html",
        styleUrls: ["todo/styles/todo.css"]
    }),
    __metadata("design:paramtypes", [angularfire2_1.AngularFire, router_1.Router, todo_service_1.TodoService])
], TodoCmp);
exports.TodoCmp = TodoCmp;
