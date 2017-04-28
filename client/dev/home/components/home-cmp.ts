import {
  Component,
  OnInit
} from "@angular/core";

import {
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";

import {
  HomeService
} from "../services/home-service";

import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import {FirebaseObjectObservable} from "angularfire2/index";
import 'rxjs/add/operator/take';

@Component({
  selector: "home-cmp",
  templateUrl: "home/templates/home.html",
  styleUrls: ["home/styles/home.css"]
})
export class HomeCmp implements OnInit {
  title: string = "NAbs";

  constructor(af: AngularFire) {
  }

  ngOnInit() {
  }
}
