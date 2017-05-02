import {
  Inject,
  Injectable
} from "@angular/core";

import {
  Observable
} from "rxjs/Observable";

import {
  Http,
  Headers
} from "@angular/http";

import "rxjs/add/operator/map";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";

@Injectable()
export class TodoService {

  private users:Subject<any[]> = new BehaviorSubject<any[]>([]);
  users$ = this.users.asObservable();

  private selectedUser:Subject<any> = new BehaviorSubject<any>(null);
  selectedUser$ = this.selectedUser.asObservable();

  private selectedImage:Subject<number> = new BehaviorSubject<number>(0);
  selectedImage$ = this.selectedImage.asObservable();

  addUsers(users:any[]) {
    this.users.next(users);
  }

  setSelectedUser(selUser: any){
    this.selectedUser.next(selUser);
  }

  setSelectedImage(selImage: any){
    this.selectedImage.next(selImage);
  }

}
