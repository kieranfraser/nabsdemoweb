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
  TodoService
} from "../services/todo-service";

import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import {FirebaseObjectObservable} from "angularfire2/index";
import 'rxjs/add/operator/take';
import {Router} from "@angular/router";
import {SpinnerComponent} from "./spinner-cmp";

@Component({
  selector: "todo-cmp",
  templateUrl: "todo/templates/todo.html",
  styleUrls: ["todo/styles/todo.css"]
})
export class TodoCmp implements OnInit {
  title: string = "NAbs";

  public users: any[] = [];
  public isRequesting: boolean;

  constructor(af: AngularFire, private router: Router, private todoService:TodoService) {
    this.isRequesting = true;
    af.database.list("web/users/").subscribe(data=>{
      for(var val of data){
        this.users.push(val);
      }
      this.todoService.addUsers(this.users);
      this.router.navigate(['/home']);
    });
  }

  ngOnInit() {}
}
