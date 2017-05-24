import {
  Component,
  OnInit, ViewChild, AfterViewChecked, AfterViewInit
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
import {Message} from "../model/message";

const NABS_AUTHOR: string = "NAbs";
const USER_AUTHOR: string = "Me";

@Component({
  selector: "sim-cmp",
  templateUrl: "sim/templates/sim.html",
  styleUrls: ["sim/styles/sim.css", "sim/styles/timeline.css", "sim/styles/chat.css"]
})
export class SimCmp implements OnInit, AfterViewChecked, AfterViewInit{
  title: string = "NAbs";

  /**
   * Used for the chat box collapse
   * @type {boolean}
   */
  usersMessage: string;
  public isCollapsed:boolean = true;
  private messages: Message[] = [];
  private messageNumber = 0;
  private showChat = false;

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

  @ViewChild('lgModalSingleControl') lgModalSingleControl;
  @ViewChild('lgModalNotifDetail') lgModalNotifDetail;
  @ViewChild('userMessageInput') userMessageInput;
  @ViewChild('chatWindow') chatWindow;

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

  private featureValueLabels = ["family", "work", "social", "interest"];
  private subjectRankings = [5, 5, 5, 5];

  private resultLabels = ["now", "v. soon", "soon", "later", "m. later"];
  private resultRankings = [10, 8, 6, 4, 2];

  private changeDelGraph1Labels = ["sender", "subject", "app", "result"];
  private changeDelGraph1Data = [5, 5, 5, 6];

  private selectedFeature;
  private selectedTime;

  private view: string;

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

    var m = new Message(1, "first message", "Kieran", "12:30", "imagesrc");
    this.messages.push(m);
  }

  ngOnInit() {
    console.log("init");
    this.view = "normal";
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
  }

  ngAfterViewChecked(){
    try{
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      this.userMessageInput.nativeElement.focus();
    } catch(err){}
    if(this.view == "controlPanel"){
      this.svgGraph();
    }
  }

  ngAfterViewInit(){}
  /**
   * Toggle the chat box in and out of view depending on modal selected.
   */
  toggleChat(){
    if(this.showChat == true){
      this.showChat = false;
    }
    else{
      this.showChat = true;
    }
  }

  /**
   * Used in chat box for determining right or left side.
   * @param author
   * @returns {boolean}
   */
  isNabs(author: string){
    if(author == "NAbs")
      return true;
    else
      return false;
  }

  /**
   * Initialization of the interactive graph
   */
  svgGraph(){
    var data = this.subjectRankings;

    var line = new RGraph.Line({
      id: 'cvsSubject',
      data: this.changeDelGraph1Data,
      options: {
        textAccessible: true,
        labels: this.changeDelGraph1Labels,
        adjustable: true,
        gutterLeft: 25,
        gutterRight: 25,
        gutterTop: 50,
        gutterBottom: 25,
        numyticks: 10,
        ylabels: true,
        xlabels: true,
        labelsOffsetx: 5,
        labelsOffsety: 5
      }
    }).draw().on('onadjustend', function (obj)
    {
      this.changeDelGraph1Data = obj.data;
    });

    /*var barSubject = new RGraph.Bar({
      id: 'cvsSubject',
      data: this.changeDelGraph1Data,
      options: {
        labels: this.changeDelGraph1Labels,
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
      this.changeDelGraph1Data = obj.data;
    });*/

    /*var barSender = new RGraph.Bar({
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
    });*/
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
   * Called when the user responds via the chat window - similar to above for
   * speech.
   * @param response
   */
  userResponse(): void{
    var response = this.usersMessage;
    this.usersMessage = "";
    this.messages.push(new Message(this.messageNumber++, response, USER_AUTHOR, Date.now().toString(), "img"));
    this.continueConvoMsg(response);
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

  /**
   * Called when the user presses the microphone button - initiates watson convo
   * and gets response back.
   */
  beginConvo(){

    this.messages = [];
    this.messageNumber = 0;
    this.convoContext = null;
    //this.lgModalControl.show();
    this.simService
      .beginConvoRequest()
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        this.askSomething(response.text);
        this.activateSpeechSearch();
      });
  }

  /**
   * Same as above but for the chat box instead of speech.
   */
  beginConvoMsg(){
    this.messages = [];
    this.messageNumber = 0;
    this.convoContext = null;
    this.simService
      .beginConvoRequest()
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        this.messages.push(new Message(this.messageNumber, response.text, NABS_AUTHOR, Date.now().toString(), "img"));
        this.userMessageInput.nativeElement.focus();
      });
  }

  /**
   * Conversation with watson is continued - actions are in a switch statement.
   * Ends the conversation.
   * @param userResponse
   */
  continueConvo(userResponse: string){
    this.simService
      .continueConvoRequest(userResponse, this.convoContext)
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        var action = response.output.action;
        // switch and case
        switch(action){
          case "open_control_panel":
            this.lgModalNotifDetail.hide();
            this.lgModalSingleControl.show();
        }
        // open up the control panel (for change delivery)


        // else
        this.askSomething(response.text);
        this.activateSpeechSearch();
      });
  }

  /**
   * Same as above but for the chat box.
   * @param userResponse
   */
  continueConvoMsg(userResponse: string){
    this.simService
      .continueConvoRequest(userResponse, this.convoContext)
      .subscribe((response) => {
        console.log(response);
        this.convoContext = response.context;
        var action = response.output.action;
        // switch and case
        switch(action){
          case "open_control_panel":
            this.lgModalNotifDetail.hide();
            //this.lgModalSingleControl.show();
            this.view = "controlPanel";
            break;
        }
        // open up the control panel (for change delivery)


        // else
        this.messages.push(new Message(this.messageNumber++, response.text, NABS_AUTHOR, Date.now().toString(), "img"))
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

  /*  Actions  */


}
