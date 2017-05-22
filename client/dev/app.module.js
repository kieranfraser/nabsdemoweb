"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var app_1 = require("./app");
var todo_cmp_1 = require("./todo/components/todo-cmp");
var todo_route_1 = require("./todo/components/todo-route");
var todo_service_1 = require("./todo/services/todo-service");
var angularfire2_1 = require("angularfire2");
var home_cmp_1 = require("./home/components/home-cmp");
var home_service_1 = require("./home/services/home-service");
var home_route_1 = require("./home/components/home-route");
var spinner_cmp_1 = require("./todo/components/spinner-cmp");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var sim_service_1 = require("./sim/services/sim-service");
var sim_cmp_1 = require("./sim/components/sim-cmp");
var sim_route_1 = require("./sim/components/sim-route");
var speech_recognition_service_1 = require("./sim/services/speech-recognition-service");
exports.config = {
    apiKey: "AIzaSyBuH2Fjok4gt7ouDB2tz39DU51DFEaYcY0",
    authDomain: "nabsdemo.firebaseapp.com",
    databaseURL: "https://nabsdemo.firebaseio.com",
    projectId: "nabsdemo",
    storageBucket: "nabsdemo.appspot.com",
    messagingSenderId: "968367753735"
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            todo_route_1.todoRouting,
            home_route_1.homeRouting,
            sim_route_1.simRouting,
            angularfire2_1.AngularFireModule.initializeApp(exports.config),
            forms_1.FormsModule,
            ngx_bootstrap_1.ModalModule.forRoot(),
            ngx_bootstrap_1.CollapseModule.forRoot(),
        ],
        declarations: [
            app_1.App,
            home_cmp_1.HomeCmp,
            todo_cmp_1.TodoCmp,
            sim_cmp_1.SimCmp,
            spinner_cmp_1.SpinnerComponent,
        ],
        providers: [
            todo_service_1.TodoService,
            home_service_1.HomeService,
            sim_service_1.SimService,
            speech_recognition_service_1.SpeechRecognitionService,
        ],
        bootstrap: [
            app_1.App,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
