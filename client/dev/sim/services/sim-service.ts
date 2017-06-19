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

  private baseUrlResult = this.baseLocal+'/result';
  private baseUrlParams = this.baseLocal+'/params';
  private baseUrlResultParams = this.baseLocal+'/resultparams';
  private baseUrlResultSubjectAlert = this.baseLocal+'/firesubjectalert';

  private baseUrlResultChangeDelivery = this.baseLocal+'/resultforchangedelivery';
  private baseUrlNotifEvents = this.baseLocal+'/notificationevents';
  private baseUrlBeginConvo = this.baseLocal+'/beginconvo';
  private baseUrlContinueConvo = this.baseLocal+'/continueconvo';

  constructor (@Inject(Http) private _http: Http) {}

  getResults(userId: string) : Observable<any> {
    return this._http.get(this.baseUrlResult+"?user="+userId+"&notifId=something")
      .map((r) => r.json());
  }

  getResultWithAlertParams(userId: string, alertParams: string[]) : Observable<any> {
    return this._http.get(this.baseUrlResultParams+"?user="+userId+"&params="+alertParams)
      .map((r) => r.json());
  }

  getResultForChangeDelivery(userId: string, notificationId: number, alertParams: string[],
                            notificationFeature: string, ranking: number) : Observable<any> {
    return this._http.get(this.baseUrlResultChangeDelivery+"?user="+userId+"&notificationId="+notificationId
      +"&ruleParams="+alertParams+"&notificationFeature="+notificationFeature+"&ranking="+ranking)
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

  beginConvoRequest() : Observable<any> {
    return this._http.get(this.baseUrlBeginConvo)
      .map((r) => r.json());
  }

  continueConvoRequest(input: String, context: any) : Observable<any> {
      return this._http.post(this.baseUrlContinueConvo+"?input="+input, JSON.stringify(context))
      .map((r) => r.json());
  }

  getResultsForSubectAlert(userId: string, alertParams: string[], rankings: number[]) : Observable<any> {
    return this._http.get(this.baseUrlResultSubjectAlert+"?user="+userId+"&params="+alertParams+"&rankings="+rankings)
      .map((r) => r.json());
  }

}
