"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var a,i=arguments.length,c=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(c=(i<3?a(c):i>3?a(t,r,c):a(t,r))||c);return i>3&&c&&Object.defineProperty(t,r,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),todo_service_1=require("../services/todo-service"),angularfire2_1=require("angularfire2");require("rxjs/add/operator/take");var router_1=require("@angular/router"),TodoCmp=function(){function e(e,t,r){this.router=t,this.todoService=r,this.title="NAbs",this.users=[],this.isRequesting=!0}return e.prototype.ngOnInit=function(){},e}();TodoCmp=__decorate([core_1.Component({selector:"todo-cmp",templateUrl:"todo/templates/todo.html",styleUrls:["todo/styles/todo.css"]}),__metadata("design:paramtypes",[angularfire2_1.AngularFire,router_1.Router,todo_service_1.TodoService])],TodoCmp),exports.TodoCmp=TodoCmp;