"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sim_service_1 = require("../services/sim-service");
var angularfire2_1 = require("angularfire2");
require("rxjs/add/operator/take");
var todo_service_1 = require("../../todo/services/todo-service");
var router_1 = require("@angular/router");
var speech_recognition_service_1 = require("../services/speech-recognition-service");
var message_1 = require("../model/message");
var NABS_AUTHOR = "NAbs";
var USER_AUTHOR = "Me";
var SimCmp = (function () {
    function SimCmp(af, todoService, router, simService, speechService) {
        var _this = this;
        this.af = af;
        this.todoService = todoService;
        this.router = router;
        this.simService = simService;
        this.speechService = speechService;
        this.title = "NAbs";
        this.isCollapsed = true;
        this.messages = [];
        this.messageNumber = 0;
        this.showChat = false;
        this.selectedUser = null;
        this.selectedImage = null;
        this.allResults = null;
        this.selectedUserEvents = null;
        this.alertParams = null;
        this.selectedNotification = null;
        this.selectedNotificationEvents = null;
        this.selectedResult = null;
        this.alertSenderInputValues = ["NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP", "NIP",
            "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT", "IMPORTANT",
            "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP"];
        this.alertSubjectInputValues = ["NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP",
            "NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP",
            "NIP", "NIP", "NIP", "IMPORTANT", "IMPORTANT", "IMPORTANT", "VIP", "VIP", "VIP"];
        this.alertAppInputValues = ["NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP",
            "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP",
            "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP", "NIP", "IMPORTANT", "VIP"];
        this.alertOptions = ["NOW", "VERYSOON", "SOON", "LATER", "MUCHLATER"];
        this.defaultParams = null;
        this.featureValueLabels = ["family", "work", "social", "interest"];
        this.subjectRankings = [5, 5, 5, 5];
        this.resultLabels = ["now", "v. soon", "soon", "later", "m. later"];
        this.resultRankings = [10, 8, 6, 4, 2];
        this.changeDelGraph1Labels = ["sender", "subject", "app", "result"];
        this.changeDelGraph1Data = [5, 5, 5, 6];
        this.selectedFeature = "sender";
        this.selectedTime = "sooner";
        this.resultLineGraph = null;
        this.subscriptionOne = this.todoService.selectedUser$.subscribe(function (selectedUser) {
            _this.selectedUser = selectedUser;
            console.log("sel user");
        });
        this.subscriptionTwo = this.todoService.selectedImage$.subscribe(function (selectedImage) {
            _this.selectedImage = selectedImage;
            console.log("sel image");
            console.log(_this.selectedImage);
        });
        this.synth = window.speechSynthesis;
        var voices = this.synth.getVoices();
        this.voice = voices[3];
        this.view = "normal";
    }
    SimCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.controlType = '2';
        if (this.selectedUser == null) {
            this.router.navigate(['../']);
        }
        else {
            this.simService
                .getDefaultAlertParams()
                .subscribe(function (resultParams) {
                _this.alertParams = resultParams;
                _this.simService
                    .getDefaultAlertParams()
                    .subscribe(function (resultParams) {
                    _this.defaultParams = resultParams;
                    _this.fireAllParams();
                });
            });
        }
    };
    SimCmp.prototype.ngAfterViewChecked = function () {
        try {
            this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
            this.userMessageInput.nativeElement.focus();
        }
        catch (err) { }
    };
    /**
     * Toggle the chat box in and out of view depending on modal selected.
     */
    SimCmp.prototype.toggleChat = function () {
        if (this.showChat == true) {
            this.showChat = false;
        }
        else {
            this.showChat = true;
        }
    };
    /**
     * Used in chat box for determining right or left side.
     * @param author
     * @returns {boolean}
     */
    SimCmp.prototype.isNabs = function (author) {
        if (author == "NAbs")
            return true;
        else
            return false;
    };
    /**
     * Speaks given text input and listens for a response
     * @param text
       */
    SimCmp.prototype.askSomething = function (text) {
        var msg = new SpeechSynthesisUtterance(text);
        msg.voice = this.voice;
        this.synth.speak(msg);
        /*msg.onend = function(e) {
          this.activateSpeechSearch();
        }.bind(this);*/
    };
    /**
     * Activates the speech recording service
     */
    SimCmp.prototype.activateSpeechSearch = function () {
        var _this = this;
        this.speechService.record()
            .subscribe(
        //listener
        function (value) {
            _this.speechData = value;
            console.log(value);
            _this.continueConvo(value);
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
        function (err) {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                _this.activateSpeechSearch();
            }
        }, 
        //completion
        function () {
        });
    };
    /**
     * Called when the user responds via the chat window - similar to above for
     * speech.
     * @param response
     */
    SimCmp.prototype.userResponse = function () {
        var response = this.usersMessage;
        this.usersMessage = "";
        this.messages.push(new message_1.Message(this.messageNumber++, response, USER_AUTHOR, Date.now().toString(), "img"));
        this.continueConvoMsg(response);
    };
    /**
     * Navigates back to previous page correctly.
     */
    SimCmp.prototype.switchUser = function () {
        this.router.navigate(['../']);
    };
    /**
     * Called when notification button is pressed - sets the selected
     * notification
     * @param notification
       */
    SimCmp.prototype.notificationSelected = function (notification) {
        this.selectedNotification = notification;
    };
    /**
     * Fires all notifications using alert params.
     */
    SimCmp.prototype.fireAllParams = function () {
        var _this = this;
        this.simService
            .getResultWithAlertParams(this.selectedUser.id, this.alertParams)
            .subscribe(function (allResults) {
            console.log('New results');
            console.log(allResults);
            _this.allResults = allResults;
        });
    };
    SimCmp.prototype.setNotification = function (notification, result) {
        this.selectedNotification = notification;
        this.selectedResult = result;
        this.getNotificationEvents();
    };
    /**
     * Used for the list of notifications.
     * @param index
     * @param value
     * @returns {number}
       */
    SimCmp.prototype.trackByIndex = function (index, value) {
        return index;
    };
    /**
     * Gets the events surrounding a particular notification.
     */
    SimCmp.prototype.getNotificationEvents = function () {
        var _this = this;
        this.simService
            .getNotificationEvents(this.selectedUser.id, this.selectedNotification.date)
            .subscribe(function (eventResults) {
            _this.selectedNotificationEvents = eventResults;
            /*for(var event of this.selectedNotificationEvents){
              var d = new Date(event.endDate);
              event.endDate = d;
              d = new Date(event.startDate);
              event.startDate = d;
            }*/
        });
    };
    /**
     * Resets the alert params to the default values.
     */
    SimCmp.prototype.resetParams = function () {
        var _this = this;
        this.simService
            .getDefaultAlertParams()
            .subscribe(function (resultParams) {
            _this.alertParams = resultParams;
        });
    };
    /**
     * Checks the difference between current and default rules to set the
     * default/custom tag on the button
     * @returns {boolean}
       */
    SimCmp.prototype.checkCustomRules = function () {
        for (var i = 0; i < this.alertParams.length; i++) {
            if (this.alertParams[i] != this.defaultParams[i]) {
                return true;
            }
        }
        return false;
    };
    /**
     * Closes the control panel view
     */
    SimCmp.prototype.closeControl = function () {
        this.view = 'normal';
        this.showChat = false;
    };
    /**
     * Called when the user presses the microphone button - initiates watson convo
     * and gets response back.
     */
    SimCmp.prototype.beginConvo = function () {
        var _this = this;
        this.messages = [];
        this.messageNumber = 0;
        this.convoContext = null;
        //this.lgModalControl.show();
        this.simService
            .beginConvoRequest()
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            _this.askSomething(response.text);
            _this.activateSpeechSearch();
        });
    };
    /**
     * Same as above but for the chat box instead of speech.
     */
    SimCmp.prototype.beginConvoMsg = function () {
        var _this = this;
        this.messages = [];
        this.messageNumber = 0;
        this.convoContext = null;
        this.simService
            .beginConvoRequest()
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            _this.messages.push(new message_1.Message(_this.messageNumber, response.text, NABS_AUTHOR, Date.now().toString(), "img"));
            _this.userMessageInput.nativeElement.focus();
        });
    };
    /**
     * Conversation with watson is continued - actions are in a switch statement.
     * Ends the conversation.
     * @param userResponse
     */
    SimCmp.prototype.continueConvo = function (userResponse) {
        var _this = this;
        this.simService
            .continueConvoRequest(userResponse, this.convoContext)
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            var action = response.output.action;
            // switch and case
            switch (action) {
                case "open_control_panel":
                    _this.lgModalNotifDetail.hide();
                    _this.view = "controlPanel";
                    _this.selectedTime = response.context.delivery_time;
                    _this.selectedFeature = response.context.notification_feature;
                    break;
            }
            // open up the control panel (for change delivery)
            // else
            _this.askSomething(response.text);
            _this.activateSpeechSearch();
        });
    };
    /**
     * Same as above but for the chat box.
     * @param userResponse
     */
    SimCmp.prototype.continueConvoMsg = function (userResponse) {
        var _this = this;
        this.simService
            .continueConvoRequest(userResponse, this.convoContext)
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            var action = response.output.action;
            // switch and case
            switch (action) {
                case "open_control_panel":
                    _this.lgModalNotifDetail.hide();
                    _this.view = "controlPanel";
                    _this.selectedTime = response.context.delivery_time;
                    _this.selectedFeature = response.context.notification_feature;
                    break;
            }
            // open up the control panel (for change delivery)
            // else
            _this.messages.push(new message_1.Message(_this.messageNumber++, response.text, NABS_AUTHOR, Date.now().toString(), "img"));
        });
    };
    return SimCmp;
}());
__decorate([
    core_1.ViewChild('lgModalSingleControl'),
    __metadata("design:type", Object)
], SimCmp.prototype, "lgModalSingleControl", void 0);
__decorate([
    core_1.ViewChild('lgModalNotifDetail'),
    __metadata("design:type", Object)
], SimCmp.prototype, "lgModalNotifDetail", void 0);
__decorate([
    core_1.ViewChild('userMessageInput'),
    __metadata("design:type", Object)
], SimCmp.prototype, "userMessageInput", void 0);
__decorate([
    core_1.ViewChild('chatWindow'),
    __metadata("design:type", Object)
], SimCmp.prototype, "chatWindow", void 0);
SimCmp = __decorate([
    core_1.Component({
        selector: "sim-cmp",
        templateUrl: "sim/templates/sim.html",
        styleUrls: ["sim/styles/sim.css", "sim/styles/timeline.css", "sim/styles/chat.css"]
    }),
    __metadata("design:paramtypes", [angularfire2_1.AngularFire, todo_service_1.TodoService, router_1.Router,
        sim_service_1.SimService, speech_recognition_service_1.SpeechRecognitionService])
], SimCmp);
exports.SimCmp = SimCmp;
