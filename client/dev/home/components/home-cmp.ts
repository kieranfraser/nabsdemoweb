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
import {Subscription} from "rxjs/Subscription";
import {TodoService} from "../../todo/services/todo-service";
import {SpinnerComponent} from "../../todo/components/spinner-cmp";
import {Router} from "@angular/router";

@Component({
  selector: "home-cmp",
  templateUrl: "home/templates/home.html",
  styleUrls: ["home/styles/home.css"]
})
export class HomeCmp implements OnInit {
  title: string = "NAbs";

  subscription: Subscription;
  private users: any[];
  public isRequesting: boolean;
  private selectedUser:any = null;
  private selectedNotification: any = null;
  private selectedImage: number = null;

  constructor(private af: AngularFire, private todoService: TodoService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.todoService.users$.subscribe(
      users => {
        this.users = users;
        if(this.users.length == 0){
          this.isRequesting = true;
          this.af.database.list("web/users/").subscribe(data=>{
            for(var val of data){
              this.users.push(val);
            }
            this.todoService.addUsers(this.users);
            this.isRequesting = false;
          });
        }

      });
  }

  selectUser(user: any, index: number){
    this.selectedUser = user;
    this.selectedImage = index;
    this.todoService.setSelectedUser(user);
    this.todoService.setSelectedImage(index);
  }

  notificationSelected(notification: any){
    this.selectedNotification = notification;
  }
}
