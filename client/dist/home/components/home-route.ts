import {
	Routes,
	RouterModule
} from "@angular/router";

import {
	HomeCmp
} from "../components/home-cmp";

const homeRoutes:Routes = [
	{
		path: "",
		component: HomeCmp,
		pathMatch: "full"
	}
]

export const homeRouting = RouterModule.forRoot(homeRoutes);
