"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var sim_cmp_1 = require("../components/sim-cmp");
var simRoutes = [
    {
        path: "simulation",
        component: sim_cmp_1.SimCmp,
        pathMatch: "full"
    }
];
exports.simRouting = router_1.RouterModule.forRoot(simRoutes);
