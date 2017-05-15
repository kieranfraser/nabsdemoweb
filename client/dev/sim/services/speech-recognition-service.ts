/**
 * Created by kfraser on 10/05/2017.
 */
import {
  Http,
  Headers
} from "@angular/http";


import { Injectable, NgZone, Inject } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import * as _ from "lodash";

import "rxjs/add/operator/map";
import 'rxjs/add/operator/catch';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class SpeechRecognitionService {
  speechRecognition: any;

  //private baseUrl = 'https://nabsdemo.herokuapp.com/result';
  private base = 'https://nabsdemo.herokuapp.com';
  private baseLocal = 'http://localhost:8080';

  private urlContinueCheck = this.baseLocal+'/speechcheckcontinue';

  constructor(private zone: NgZone, @Inject(Http) private _http: Http) {
  }

  public record(): Observable<string> {

    return Observable.create(observer => {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();
      //this.speechRecognition = SpeechRecognition;
      this.speechRecognition.continuous = true;
      //this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        let term: string = "";
        if (speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log("Unrecognized result - Please try again");
            }
            else {
              term = _.trim(transcript);
              console.log("Did you said? -> " + term + " , If not then say something else...");
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
      console.log("Say something - We are listening !!!");
    });
  }

  DestroySpeechObject() {
    if (this.speechRecognition)
      this.speechRecognition.stop();
  }

  getContinueResult(response: string) : Observable<any> {
    return this._http.get(this.urlContinueCheck+"?response="+response)
      .map((r) => r.json());
  }

}
