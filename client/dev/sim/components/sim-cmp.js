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
var SimCmp = (function () {
    function SimCmp(af, todoService, router, simService, speechService) {
        var _this = this;
        this.af = af;
        this.todoService = todoService;
        this.router = router;
        this.simService = simService;
        this.speechService = speechService;
        this.title = "NAbs";
        this.selectedUser = null;
        this.selectedImage = null;
        this.allResults = null;
        this.selectedUserEvents = null;
        this.alertParams = null;
        this.selectedNotification = null;
        this.selectedNotificationEvents = null;
        this.selectedResult = null;
        this.firstQuestion = "Was this notification delivered correctly?";
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
        this.subjectLabels = ["family", "work", "social", "interest"];
        this.subjectRankings = [5, 5, 5, 5];
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
    }
    SimCmp.prototype.ngOnInit = function () {
        var _this = this;
        console.log("init");
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
        this.svgGraph();
    };
    /**
     * Initialization of the interactive graph
     */
    SimCmp.prototype.svgGraph = function () {
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
        }).draw().on('onadjustend', function (obj) {
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
        }).draw().on('onadjustend', function (obj) {
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
        }).draw().on('onadjustend', function (obj) {
            console.log(obj.data);
            this.subjectRankings = obj.data;
        });
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
     * Fired when microphone button is pushed - goes to askSomething
     */
    SimCmp.prototype.askQuestion = function () {
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
            _this.allResults = allResults;
            console.log("all results");
            console.log(_this.allResults);
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
     * Inits the secondary control modal (from within the single notification view.
     */
    SimCmp.prototype.initControl = function () {
        console.log("init the controls");
    };
    SimCmp.prototype.beginConvo = function () {
        var _this = this;
        this.simService
            .beginConvoRequest()
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            _this.askSomething("Greetings friend, how can I help?");
            _this.activateSpeechSearch();
        });
    };
    SimCmp.prototype.continueConvo = function (userResponse) {
        var _this = this;
        this.simService
            .continueConvoRequest(userResponse, this.convoContext)
            .subscribe(function (response) {
            console.log(response);
            _this.convoContext = response.context;
            // switch and case
            // else
            _this.askSomething(response.text);
            _this.activateSpeechSearch();
        });
    };
    /* Change delivery functionality */
    SimCmp.prototype.changeDeliveryAction = function (context, feature, delivery) {
        var finished = false;
        while (!finished) {
            // the array value for the notif feature passed
        }
    };
    SimCmp.prototype.valueForFeature = function (feature) {
        switch (feature) {
            case "sender":
                return this.selectedNotification.sender;
            case "subject":
                return this.selectedNotification.subject;
            case "app":
                return this.selectedNotification.app;
        }
    };
    return SimCmp;
}());
SimCmp = __decorate([
    core_1.Component({
        selector: "sim-cmp",
        templateUrl: "sim/templates/sim.html",
        styleUrls: ["sim/styles/sim.css", "sim/styles/timeline.css"]
    }),
    __metadata("design:paramtypes", [angularfire2_1.AngularFire, todo_service_1.TodoService, router_1.Router,
        sim_service_1.SimService, speech_recognition_service_1.SpeechRecognitionService])
], SimCmp);
exports.SimCmp = SimCmp;
