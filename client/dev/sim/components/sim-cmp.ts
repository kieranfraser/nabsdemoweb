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
  SimService
} from "../services/sim-service";

import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import {FirebaseObjectObservable} from "angularfire2/index";
import 'rxjs/add/operator/take';
import {Subscription} from "rxjs/Subscription";
import {TodoService} from "../../todo/services/todo-service";
import {SpinnerComponent} from "../../todo/components/spinner-cmp";
import {Router} from "@angular/router";
import {Result} from "../model/result";

@Component({
  selector: "sim-cmp",
  templateUrl: "sim/templates/sim.html",
  styleUrls: ["sim/styles/sim.css"]
})
export class SimCmp implements OnInit {
  title: string = "NAbs";

  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;

  private users: any[];
  public isRequesting: boolean;
  private selectedUser:any = null;
  private selectedNotification: any = null;
  private selectedImage: number = null;

  private allResults: Result[] = null;

  constructor(private af: AngularFire, private todoService: TodoService, private router: Router,
              private simService: SimService) {
    this.subscriptionOne = this.todoService.selectedUser$.subscribe(
      selectedUser => {
        this.selectedUser = selectedUser;
        console.log("sel user");
      });
    this.subscriptionTwo = this.todoService.selectedImage$.subscribe(
      selectedImage => {
        this.selectedImage = selectedImage;
        console.log("sel image");
        console.log(this.selectedImage);
      }
    );
  }

  ngOnInit() {
    console.log("init");
    if(this.selectedUser==null){
      this.router.navigate(['../home']);
    }
  }

  notificationSelected(notification: any){
    this.selectedNotification = notification;
  }

  fireAll(){
    this.simService
      .getResults(this.selectedUser.id)
      .subscribe((allResults) => {
        this.allResults = allResults;
      });
  }
}
