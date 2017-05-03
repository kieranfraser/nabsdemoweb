"use strict";var __decorate=this&&this.__decorate||function(e,t,r,s){var o,a=arguments.length,c=a<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,r):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,s);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(c=(a<3?o(c):a>3?o(t,r,c):o(t,r))||c);return a>3&&c&&Object.defineProperty(t,r,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__param=this&&this.__param||function(e,t){return function(r,s){t(r,s,e)}};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),http_1=require("@angular/http");require("rxjs/add/operator/map");var BehaviorSubject_1=require("rxjs/BehaviorSubject"),TodoService=function(){function e(e){this._http=e,this.baseUrlUsers="https://nabsdemo.herokuapp.com/users",this.users=new BehaviorSubject_1.BehaviorSubject([]),this.users$=this.users.asObservable(),this.selectedUser=new BehaviorSubject_1.BehaviorSubject(null),this.selectedUser$=this.selectedUser.asObservable(),this.selectedImage=new BehaviorSubject_1.BehaviorSubject(0),this.selectedImage$=this.selectedImage.asObservable()}return e.prototype.addUsers=function(e){this.users.next(e)},e.prototype.setSelectedUser=function(e){this.selectedUser.next(e)},e.prototype.setSelectedImage=function(e){this.selectedImage.next(e)},e.prototype.getUsers=function(){return this._http.get(this.baseUrlUsers).map(function(e){return e.json()})},e}();TodoService=__decorate([core_1.Injectable(),__param(0,core_1.Inject(http_1.Http)),__metadata("design:paramtypes",[http_1.Http])],TodoService),exports.TodoService=TodoService;