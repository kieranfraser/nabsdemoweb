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

  private baseUrl = 'https://nabsdemo.herokuapp.com/result';

  constructor (@Inject(Http) private _http: Http) {}

  getResults(userId: string) : Observable<any> {
    return this._http.get(this.baseUrl+"?user="+userId+"&notifId=something")
      .map((r) => r.json());
  }

}
