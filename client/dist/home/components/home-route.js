"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_cmp_1 = require("../components/home-cmp");
var homeRoutes = [
    {
        path: "home",
        component: home_cmp_1.HomeCmp,
        pathMatch: "full"
    }
];
exports.homeRouting = router_1.RouterModule.forRoot(homeRoutes);
