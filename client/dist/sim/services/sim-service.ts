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
import 'rxjs/add/operator/catch';
import {Result} from "../model/result";

@Injectable()
export class SimService {

  //private baseUrl = 'https://nabsdemo.herokuapp.com/result';
  private base = 'https://nabsdemo.herokuapp.com';
  private baseLocal = 'http://localhost:8080';

  private baseUrlResult = this.base+'/result';
  private baseUrlParams = this.base+'/params';
  private baseUrlResultParams = this.base+'/resultparams';
  private baseUrlNotifEvents = this.base+'/notificationevents';

  constructor (@Inject(Http) private _http: Http) {}

  getResults(userId: string) : Observable<any> {
    return this._http.get(this.baseUrlResult+"?user="+userId+"&notifId=something")
      .map((r) => r.json());
  }

  getResultWithAlertParams(userId: string, alertParams: string[]) : Observable<any> {
    return this._http.get(this.baseUrlResultParams+"?user="+userId+"&params="+alertParams)
      .map((r) => r.json());
  }

  getDefaultAlertParams() : Observable<any> {
    return this._http.get(this.baseUrlParams+"?type=alert")
      .map((r) => r.json());
  }

  getNotificationEvents(userId: string, date: string) : Observable<any> {
    return this._http.get(this.baseUrlNotifEvents+"?user="+userId+"&date="+date)
      .map((r) => r.json());
  }

}
