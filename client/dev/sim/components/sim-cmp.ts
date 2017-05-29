import {
  Component,
  OnInit, ViewChild, AfterViewChecked
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
declare var Highcharts: any;

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
export class SimCmp implements OnInit, AfterViewChecked{
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

  private changeDelGraph1Labels: string[] = ["sender", "subject", "app", "result"];
  private changeDelGraph1Data: number[] = [5, 5, 5, 6];

  private selectedFeature: string = "sender";
  private selectedTime: string = "sooner";

  private resultLineGraph = null;

  private view: string;
  private controlType: string;

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
    this.view = "normal";
  }

  ngOnInit() {
    this.controlType = '2';
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
  }

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
        console.log('New results');
        console.log(allResults);
        this.allResults = allResults;
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
   * Closes the control panel view
   */
  closeControl(){
    this.view = 'normal';
    this.showChat = false;
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
            this.view = "controlPanel";
            this.selectedTime = response.context.delivery_time;
            this.selectedFeature = response.context.notification_feature;
            break;
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
            this.view = "controlPanel";
            this.selectedTime = response.context.delivery_time;
            this.selectedFeature = response.context.notification_feature;
            break;
        }
        // open up the control panel (for change delivery)


        // else
        this.messages.push(new Message(this.messageNumber++, response.text, NABS_AUTHOR, Date.now().toString(), "img"))
      });
  }

}
