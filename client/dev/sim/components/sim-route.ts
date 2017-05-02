import {
	Routes,
	RouterModule
} from "@angular/router";

import {
	SimCmp
} from "../components/sim-cmp";

const simRoutes:Routes = [
	{
		path: "simulation",
		component: SimCmp,
		pathMatch: "full"
	}
]

export const simRouting = RouterModule.forRoot(simRoutes);
