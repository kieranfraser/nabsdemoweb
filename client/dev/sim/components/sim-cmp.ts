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

declare var RGraph: any;

import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import {FirebaseObjectObservable} from "angularfire2/index";
import 'rxjs/add/operator/take';
import {Subscription} from "rxjs/Subscription";
import {TodoService} from "../../todo/services/todo-service";
import {SpinnerComponent} from "../../todo/components/spinner-cmp";
import {Router} from "@angular/router";
import {Result} from "../model/result";
import {SpeechRecognitionService} from "../services/speech-recognition-service";

@Component({
  selector: "sim-cmp",
  templateUrl: "sim/templates/sim.html",
  styleUrls: ["sim/styles/sim.css", "sim/styles/timeline.css"]
})
export class SimCmp implements OnInit {
  title: string = "NAbs";

  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;

  private users: any[];
  public isRequesting: boolean;
  private selectedUser:any = null;
  private selectedImage: number = null;

  private allResults: Result[] = null;
  private selectedUserEvents: any[] = null;

  private alertParams: string[] = null;


  private selectedNotification: any = null;
  private selectedNotificationEvents: any = null;
  private selectedResult: string = null;

  private firstQuestion = "Was this notification delivered correctly?";

  private alertSenderInputValues: string[] = ["NIP","NIP","NIP","NIP","NIP","NIP","NIP","NIP","NIP",
  "IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT","IMPORTANT",
  "VIP","VIP","VIP","VIP","VIP","VIP","VIP","VIP","VIP"];

  private alertSubjectInputValues: string[] = ["NIP","NIP","NIP","IMPORTANT","IMPORTANT","IMPORTANT","VIP","VIP","VIP",
    "NIP","NIP","NIP","IMPORTANT","IMPORTANT","IMPORTANT","VIP","VIP","VIP",
    "NIP","NIP","NIP","IMPORTANT","IMPORTANT","IMPORTANT","VIP","VIP","VIP"];

  private alertAppInputValues: string[] = ["NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP",
    "NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP",
    "NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP","NIP","IMPORTANT","VIP"];

  private alertOptions: string[] = ["NOW", "VERYSOON", "SOON", "LATER", "MUCHLATER"];

  private defaultParams: string[] = null;

  speechData: string;

  private synth: any;
  private voice: any;

  private subjectLabels = ["family", "work", "social", "interest"];
  private subjectRankings = [5, 5, 5, 5];

  // Phase of questioning
  /* Step 1: ask if the notification is correct
  *  Step 2: ask if it should have been delivered sooner or later
  *  Step 3: ask which part of the notification provides evidence for this
  *  */
  private convoContext;

  constructor(private af: AngularFire, private todoService: TodoService, private router: Router,
              private simService: SimService, private speechService: SpeechRecognitionService) {
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
    this.synth = window.speechSynthesis;
    var voices = this.synth.getVoices();
    this.voice = voices[3];

  }

  ngOnInit() {
    console.log("init");
    if(this.selectedUser==null){
      this.router.navigate(['../']);
    }
    else{
      this.simService
        .getDefaultAlertParams()
        .subscribe((resultParams) => {
          this.alertParams = resultParams;
          this.simService
            .getDefaultAlertParams()
            .subscribe((resultParams) => {
              this.defaultParams = resultParams;
              this.fireAllParams();
            });
        });
    }

    this.svgGraph();
  }

  /**
   * Initialization of the interactive graph
   */
  svgGraph(){
    var data = this.subjectRankings;

    var barSubject = new RGraph.Bar({
      id: 'cvsSubject',
      data: data,
      options: {
        labels: this.subjectLabels,
        textAccessible: true,
        adjustable: true,
        numyticks: 10,
        ylabels: true,
        ymax: 10,
        shadowOffsetx: 1,
        shadowOffsety: 1,
        shadowBlur: 5,
        gutterLeft: 5,
        gutterRight: 5,
        gutterTop: 50,
        gutterBottom: 5,
        ymin: 0.1,
        scaleRound: false,
      }
    }).draw().on('onadjustend', function (obj)
    {
      console.log(obj.data);
      this.subjectRankings = obj.data;
    });

    var barSender = new RGraph.Bar({
      id: 'cvsSender',
      data: data,
      options: {
        labels: this.subjectLabels,
        textAccessible: true,
        adjustable: true,
        numyticks: 10,
        ylabels: true,
        ymax: 10,
        shadowOffsetx: 1,
        shadowOffsety: 1,
        shadowBlur: 5,
        gutterLeft: 5,
        gutterRight: 5,
        gutterTop: 50,
        gutterBottom: 5,
        ymin: 0.1,
        scaleRound: false,
      }
    }).draw().on('onadjustend', function (obj)
    {
      console.log(obj.data);
      this.subjectRankings = obj.data;
    });

    var barApp = new RGraph.Bar({
      id: 'cvsApp',
      data: data,
      options: {
        labels: this.subjectLabels,
        textAccessible: true,
        adjustable: true,
        numyticks: 10,
        ylabels: true,
        ymax: 10,
        shadowOffsetx: 1,
        shadowOffsety: 1,
        shadowBlur: 5,
        gutterLeft: 5,
        gutterRight: 5,
        gutterTop: 50,
        gutterBottom: 5,
        ymin: 0.1,
        scaleRound: false,
      }
    }).draw().on('onadjustend', function (obj)
    {
      console.log(obj.data);
      this.subjectRankings = obj.data;
    });
  }

  /**
   * Speaks given text input and listens for a response
   * @param text
     */
  askSomething(text: string){
    var msg = new SpeechSynthesisUtterance(text);
    msg.voice = this.voice;
    this.synth.speak(msg);
    /*msg.onend = function(e) {
      this.activateSpeechSearch();
    }.bind(this);*/
  }

  /**
   * Fired when microphone button is pushed - goes to askSomething
   */
  askQuestion(){
    this.askSomething('Do you think this notification is right?');
    /*var synth = window.speechSynthesis;

    var voices = synth.getVoices();

    for(var i = 0; i < voices.length ; i++) {
      console.log(voices[i])
    }

    var msg = new SpeechSynthesisUtterance('Do you think this notification was delivered correctly?');
    msg.voice = voices[3];
    synth.speak(msg);
    msg.onend = function(e) {
      this.startListening();
    }.bind(this);*/
  }

  /**
   * Activates the speech recording service
   */
  activateSpeechSearch(): void {

    this.speechService.record()
      .subscribe(
        //listener
        (value) => {
          this.speechData = value;
          console.log(value);
          this.continueConvo(value);
          /*this.speechService
            .getContinueResult(this.speechData)
            .subscribe((result)=> {
              if(result){
                var msg = new SpeechSynthesisUtterance("Okay, let's investigate!");
                window.speechSynthesis.speak(msg);
                console.log("Continue with the understanding phase!");
              }
              else{
                var msg = new SpeechSynthesisUtterance('Great!');
                window.speechSynthesis.speak(msg);
                console.log("All's good - finish")
              }
              this.speechService.DestroySpeechObject();
            });*/
        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            this.activateSpeechSearch();
          }
        },
        //completion
        () => {

        });
  }

  /**
   * Navigates back to previous page correctly.
   */
  switchUser(){
    this.router.navigate(['../']);
  }

  /**
   * Called when notification button is pressed - sets the selected
   * notification
   * @param notification
     */
  notificationSelected(notification: any){
    this.selectedNotification = notification;
  }

  /**
   * Fires all notifications using alert params.
   */
  fireAllParams(){
    this.simService
      .getResultWithAlertParams(this.selectedUser.id, this.alertParams)
      .subscribe((allResults)=> {
        this.allResults = allResults;
        console.log("all results");
        console.log(this.allResults);
      });
  }

  setNotification(notification: any, result: string){
    this.selectedNotification = notification;
    this.selectedResult = result;
    this.getNotificationEvents();
  }

  /**
   * Used for the list of notifications.
   * @param index
   * @param value
   * @returns {number}
     */
  trackByIndex(index: number, value: number) {
    return index;
  }

  /**
   * Gets the events surrounding a particular notification.
   */
  getNotificationEvents(){
    this.simService
      .getNotificationEvents(this.selectedUser.id, this.selectedNotification.date)
      .subscribe((eventResults)=> {
        this.selectedNotificationEvents = eventResults;
        /*for(var event of this.selectedNotificationEvents){
          var d = new Date(event.endDate);
          event.endDate = d;
          d = new Date(event.startDate);
          event.startDate = d;
        }*/
      });
  }

  /**
   * Resets the alert params to the default values.
   */
  resetParams(){
    this.simService
      .getDefaultAlertParams()
      .subscribe((resultParams) => {
        this.alertParams = resultParams;
      });
  }

  /**
   * Checks the difference between current and default rules to set the
   * default/custom tag on the button
   * @returns {boolean}
     */
  checkCustomRules(){
    for(var i=0; i<this.alertParams.length; i++){
      if(this.alertParams[i] != this.defaultParams[i]){
        return true;
      }
    }
    return false;
  }

  /**
   * Inits the secondary control modal (from within the single notification view.
   */
  initControl(){
    console.log("init the controls");
  }

  beginConvo(){
    this.simService
      .beginConvoRequest()
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        this.askSomething("Greetings friend, how can I help?");
        this.activateSpeechSearch();
      });
  }

  continueConvo(userResponse: string){
    this.simService
      .continueConvoRequest(userResponse, this.convoContext)
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        // switch and case

        // else
        this.askSomething(response.text);
        this.activateSpeechSearch();
      });
  }

  /* Change delivery functionality */

  changeDeliveryAction(context: any, feature: string, delivery: string){
    var finished = false;
    while(!finished){
      // the array value for the notif feature passed

    }
  }

  valueForFeature(feature: string): string {
    switch(feature){
      case "sender":
        return this.selectedNotification.sender;
      case "subject":
        return this.selectedNotification.subject;
      case "app":
        return this.selectedNotification.app;
    }
  }

}
