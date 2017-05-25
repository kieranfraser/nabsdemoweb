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
 * Created by Kieran on 24/05/2017.
 */
var core_1 = require("@angular/core");
var sim_service_1 = require("../services/sim-service");
var ControlCmp = (function () {
    function ControlCmp(simService) {
        this.simService = simService;
        this.rankingValues = ['now', 'very soon', 'soon', 'later', 'much later'];
        this.finishedReason = null;
        this.originalResult = null;
        this.originalNotification = null;
        this.newResult = null;
        this.currentRanking = null;
        this.finished = false;
        this.resultGraph = null;
    }
    ControlCmp.prototype.ngOnInit = function () {
        //this.svgGraph();
        console.log(this.labels);
        console.log(this.data);
        console.log(this.selectedNotification);
        console.log(this.deliveryDirection);
        console.log(this.notificationFeature);
        console.log('on init');
        this.finishedReason = null;
        this.originalResult = this.result;
        this.originalNotification = this.selectedNotification;
        this.getRankingsFromNotification();
        console.log(this.data);
        var i = this.labels.indexOf(this.notificationFeature);
        this.currentRanking = this.data[i];
    };
    ControlCmp.prototype.ngAfterViewChecked = function () { };
    ControlCmp.prototype.ngAfterViewInit = function () {
        this.svgGraph();
    };
    ControlCmp.prototype.getRankingsFromNotification = function () {
        if (this.selectedNotification != null) {
            var resultRanking = (this.rankingValues.indexOf(this.originalResult) * 2) + 2;
            this.data = [this.selectedNotification.senderRank, this.selectedNotification.subjectRank, this.selectedNotification.appRank, resultRanking];
        }
    };
    /**
     * Initialization of the interactive graph
     */
    ControlCmp.prototype.svgGraph = function () {
        Highcharts.chart('rankingChart', {
            title: {
                text: 'Ranking Control'
            },
            subtitle: {
                text: '...'
            },
            xAxis: {
                categories: ['Sender', 'Subject', 'App', 'Result']
            },
            yAxis: {
                title: {
                    text: 'Importance (1-10)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                    name: 'Ranking',
                    data: this.data
                }]
        });
        var eventData = this.prepEventData();
        Highcharts.chart('eventChart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Relevant Events'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No. Events'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
            },
            series: [{
                    name: 'Relevant Events',
                    data: [
                        ['Sender', eventData[0]],
                        ['Subject', eventData[1]]
                    ],
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}',
                        y: 10,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
        });
    };
    ControlCmp.prototype.prepEventData = function () {
        var senderCount = 0;
        var subjectCount = 0;
        if (this.notificationEvents != null) {
            for (var _i = 0, _a = this.notificationEvents; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.description.indexOf(this.selectedNotification.subject.subject) > -1) {
                    subjectCount++;
                }
                if (e.description.indexOf(this.selectedNotification.sender) > -1) {
                    senderCount++;
                }
            }
            return [senderCount, subjectCount];
        }
        else
            return [0, 0];
    };
    /**
     * Run changes to the notification until the desired value is met.
     */
    ControlCmp.prototype.runChanges = function () {
        var _this = this;
        console.log("in run changes");
        if (!this.finished) {
            console.log("in loop");
            console.log("current ranking: " + this.currentRanking);
            if (this.deliveryDirection == 'sooner') {
                console.log("in sooner");
                var checkSooner = this.currentRanking + 1;
                if (checkSooner < 10) {
                    this.currentRanking += 1;
                }
                if (checkSooner >= 10) {
                    this.currentRanking = 10;
                    this.finished = true;
                    this.finishedReason = "The ranking value for " + this.notificationFeature + " is at its lowest";
                    this.finished = true;
                }
            }
            else {
                console.log("in later");
                var checkLater = this.currentRanking - 1;
                if (checkLater > 1) {
                    this.currentRanking -= 1;
                }
                if (checkLater <= 1) {
                    this.currentRanking = 1;
                    this.finishedReason = "The ranking value for " + this.notificationFeature + " is at its lowest";
                    this.finished = true;
                }
            }
            this.updateSelectedNotification(this.currentRanking);
            console.log("in finishedReason");
            this.simService
                .getResultForChangeDelivery(this.user.id, this.selectedNotification.id, this.params, this.notificationFeature, this.currentRanking)
                .subscribe(function (result) {
                _this.newResult = result.result;
                if (_this.originalResult != result.result) {
                    _this.finished = true;
                }
                _this.runChanges();
            });
        }
        else {
            this.finished = false;
            this.finishedReason = null;
            console.log("final ranking " + this.currentRanking);
        }
    };
    ControlCmp.prototype.checkFinished = function () { };
    ControlCmp.prototype.updateSelectedNotification = function (ranking) {
        switch (this.notificationFeature) {
            case "sender":
                this.selectedNotification.senderRank = ranking;
                break;
            case "subject":
                this.selectedNotification.subjectRank = ranking;
                break;
            case "app":
                this.selectedNotification.appRank = ranking;
                break;
        }
        var i = this.labels.indexOf(this.notificationFeature);
        this.data[i] = this.currentRanking;
        setTimeout(function () {
            this.svgGraph();
        }.bind(this), 2000);
    };
    return ControlCmp;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ControlCmp.prototype, "labels", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ControlCmp.prototype, "data", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlCmp.prototype, "selectedNotification", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlCmp.prototype, "user", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ControlCmp.prototype, "deliveryDirection", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ControlCmp.prototype, "notificationFeature", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlCmp.prototype, "notificationEvents", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ControlCmp.prototype, "result", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ControlCmp.prototype, "params", void 0);
ControlCmp = __decorate([
    core_1.Component({
        selector: "control-cmp",
        templateUrl: "sim/templates/control.html",
        styleUrls: ["sim/styles/control.css"]
    }),
    __metadata("design:paramtypes", [sim_service_1.SimService])
], ControlCmp);
exports.ControlCmp = ControlCmp;
