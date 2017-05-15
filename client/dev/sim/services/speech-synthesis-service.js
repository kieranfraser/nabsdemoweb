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
/**
 * Created by kfraser on 13/05/2017.
 */
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var SpeechSynthesisService = (function () {
    function SpeechSynthesisService(zone) {
        this.zone = zone;
    }
    SpeechSynthesisService.prototype.speak = function (text) {
        return Rx_1.Observable.create(function (observer) {
            /*const { webkitSpeechRecognition }: IWindow = <IWindow>window;
            this.speechRecognition = new webkitSpeechRecognition();
            //this.speechRecognition = SpeechRecognition;
            this.speechRecognition.continuous = true;
            //this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-us';
            this.speechRecognition.maxAlternatives = 1;*/
            var synth = window.speechSynthesis;
            var voices = synth.getVoices();
            for (var i = 0; i < voices.length; i++) {
                console.log(voices[i]);
            }
            var msg = new SpeechSynthesisUtterance('Do you think this notification was delivered correctly?');
            msg.voice = voices[3];
            synth.speak(msg);
            /*msg.onend = function(e) {
              this.startListening();
            }.bind(this);*/
        });
    };
    return SpeechSynthesisService;
}());
SpeechSynthesisService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.NgZone])
], SpeechSynthesisService);
exports.SpeechSynthesisService = SpeechSynthesisService;
