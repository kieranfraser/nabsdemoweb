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
var sim_cmp_1 = require("./sim-cmp");
var ControlCmp = (function () {
    function ControlCmp(simService, zone) {
        this.simService = simService;
        this.zone = zone;
        this.subjectLabels = ["Family", "Work", "Social", "Interest"];
        this.subjectRankings = [5, 5, 5, 5];
        this.categories = [];
        this.immediateNotifications = [];
        this.delayedNotifications = [];
        this.rankingValues = ['much later', 'later', 'soon', 'break', 'now'];
        this.finishedReason = null;
        this.originalResult = null;
        this.originalNotification = null;
        this.newResult = null;
        this.currentRanking = null;
        this.finished = false;
        this.resultGraph = null;
        this.chart = null;
        this.chart1 = null;
        this.chart2 = null;
        this.chart3 = null;
        this.highlight = '';
        /**
         * Chart3 stuff
         */
        this.point1 = -1;
        this.point2 = -1;
        this.point3 = -1;
        this.point4 = -1;
        this.data3 = [];
        this.categories3 = [];
    }
    ControlCmp.prototype.ngOnInit = function () {
        this.finishedReason = null;
        this.originalResult = this.result;
        this.originalNotification = this.selectedNotification;
        this.getRankingsFromNotification();
        var i = this.labels.indexOf(this.notificationFeature);
        this.currentRanking = this.data[i];
        this.subjectRankings = [5, 5, 5, 5];
    };
    /**
     * Initialize the charts once the view appears.
     */
    ControlCmp.prototype.ngAfterViewInit = function () {
        if (this.controlType == '1') {
            this.initCharts1();
        }
        if (this.controlType == '2') {
            this.prepChart2Data();
            this.initCharts2();
            this.initCharts3();
        }
    };
    /**
     * Get the ranking values and add them to the data array to be
     * passed to the charts. The resultRanking is calculated based on
     * it's position in the rankingValues array (which is ordinal).
     */
    ControlCmp.prototype.getRankingsFromNotification = function () {
        if (this.selectedNotification != null) {
            this.selectedNotification.subjectRank = 5;
            var resultRanking = (this.rankingValues.indexOf(this.originalResult) * 2) + 2;
            this.data = [this.selectedNotification.senderRank, this.selectedNotification.subjectRank, this.selectedNotification.appRank, resultRanking];
        }
    };
    /**
     * Chart options
     */
    ControlCmp.prototype.initCharts1 = function () {
        this.resultGraph = Highcharts.chart('rankingChart', {
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
                },
                max: 10,
                tickInterval: 1
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
    /**
     * Subject Ranking chart
     */
    ControlCmp.prototype.initCharts2 = function () {
        this.chart = Highcharts.chart('container-ranking', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Notification Delivery Control'
            },
            xAxis: [{
                    categories: (function () { return this.getCategories(); }.bind(this))(),
                    crosshair: true
                }],
            yAxis: [{
                    tickAmount: 10,
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Notifications',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true
                }, {
                    gridLineWidth: 0,
                    title: {
                        text: 'Ranking',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
                }],
            tooltip: {
                shared: true
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            drag: function (e) {
                            },
                            drop: function (e) {
                                this.updatedate(this.subjectLabels.indexOf(e.target.series.name), e.y);
                            }.bind(this)
                        }
                    },
                    stickyTracking: false
                }
            },
            series: [{
                    name: this.subjectLabels[0],
                    type: 'column',
                    yAxis: 1,
                    data: (function () { return this.getSenderRankings(0); }.bind(this))(),
                    draggableY: true,
                    yDecimals: 0,
                    dragPrecisionY: 1,
                    dragMinY: 0
                }, {
                    name: this.subjectLabels[1],
                    type: 'column',
                    yAxis: 1,
                    data: (function () { return this.getSenderRankings(1); }.bind(this))(),
                    draggableY: true,
                    yDecimals: 0,
                    dragPrecisionY: 1,
                    dragMinY: 0
                },
                {
                    name: this.subjectLabels[2],
                    type: 'column',
                    yAxis: 1,
                    data: (function () { return this.getSenderRankings(2); }.bind(this))(),
                    draggableY: true,
                    yDecimals: 0,
                    dragPrecisionY: 1,
                    dragMinY: 0
                }, {
                    name: this.subjectLabels[3],
                    type: 'column',
                    yAxis: 1,
                    data: (function () { return this.getSenderRankings(3); }.bind(this))(),
                    draggableY: true,
                    yDecimals: 0,
                    dragPrecisionY: 1,
                    dragMinY: 0
                }, {
                    name: 'Immediate Notifications',
                    type: 'spline',
                    data: (function () { return this.getImmediateNotifications(); }.bind(this))(),
                    tooltip: {
                        valueSuffix: ' Notifications'
                    }
                },
                {
                    name: 'Notifications delayed',
                    type: 'spline',
                    data: (function () { return this.getDelayedNotifications(); }.bind(this))(),
                    tooltip: {
                        valueSuffix: ' Notifications'
                    }
                }]
        });
    };
    /**
     * Rules chart
     */
    ControlCmp.prototype.initCharts3 = function () {
        this.chart1 = new Highcharts.Chart({
            chart: {
                marginLeft: 40,
                spacingTop: 20,
                spacingBottom: 20,
                renderTo: 'container-c1',
                animation: true
            },
            title: {
                text: "Rule Set",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            xAxis: {
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    format: '{value}'
                },
                categories: (function () { return this.getCategories31(); }.bind(this))()
            },
            yAxis: {
                title: {
                    text: null
                },
                min: 0,
                max: 10
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            //drag: function (e) {
                            // Returning false stops the drag and drops. Example:
                            /*
                             if (e.newY > 300) {
                             this.y = 300;
                             return false;
                             }
                             */
                            //updatePointValue(this.category, e.y);
                            //updateNotifications(this.category, e.y);
                            /* $('#drag').html(
                             'Dragging <b>' + this.series.name + '</b>, <b>' + this.category + '</b> to <b>' + Highcharts.numberFormat(e.y) + '</b>');*/
                            //},
                            drop: function (e) {
                                //console.log(e);
                                this.updatePointValue(e.target.category, e.y);
                                this.updateNotifications31(e.target.category, e.y);
                            }.bind(this)
                        }
                    },
                    stickyTracking: false
                },
                column: {
                    stacking: 'normal'
                },
                line: {
                    cursor: 'ns-resize'
                }
            },
            tooltip: {
                positioner: function () {
                    return {
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '1px'
                },
                valueDecimals: 0
            },
            series: [{
                    data: (function () { return this.getStackData(); }.bind(this))(),
                    type: 'column',
                    name: 'Now',
                }, {
                    data: (function () { return this.getStackData(); }.bind(this))(),
                    type: 'column',
                    name: 'Soon',
                }, {
                    data: (function () { return this.getStackData(); }.bind(this))(),
                    type: 'column',
                    name: 'Later',
                }, {
                    data: (function () { return this.getLineData(); }.bind(this))(),
                    draggableY: true,
                    yDecimals: 0,
                    dragPrecisionY: 1,
                    dragMinY: 0,
                    dragMaxY: 10
                }]
        });
        this.chart2 = new Highcharts.Chart({
            chart: {
                marginLeft: 40,
                spacingTop: 20,
                spacingBottom: 20,
                renderTo: 'container-c2',
                animation: true
            },
            title: {
                text: "Immediate notifications this month",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                positioner: function () {
                    return {
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                valueDecimals: 0
            },
            series: [{
                    data: (function () { return this.getImmediateNotificationData(); }.bind(this))(),
                    type: "area",
                    color: Highcharts.getOptions().colors[1],
                    fillOpacity: 0.3,
                    tooltip: {
                        valueSuffix: ' ' + "notifications"
                    }
                }]
        });
        this.chart3 = new Highcharts.Chart({
            chart: {
                marginLeft: 40,
                spacingTop: 20,
                spacingBottom: 20,
                renderTo: 'container-c3',
                animation: true
            },
            title: {
                text: "Delayed notifications this month",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                positioner: function () {
                    return {
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                pointFormat: '{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                valueDecimals: 0
            },
            series: [{
                    data: (function () { return this.getDelayedNotificationData(); }.bind(this))(),
                    type: "area",
                    color: Highcharts.getOptions().colors[2],
                    fillOpacity: 0.3,
                    tooltip: {
                        valueSuffix: ' ' + "notifications"
                    }
                }]
        });
    };
    ControlCmp.prototype.prepChart2Data = function () {
        this.categories = [];
        this.immediateNotifications = [];
        this.delayedNotifications = [];
        for (var _i = 0, _a = this.user.notifications; _i < _a.length; _i++) {
            var n = _a[_i];
            // prepare the categories - month notification delivered
            var dateString = n.date.substring(0, 8);
            var dateParts = dateString.split("/");
            var dateDate = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
            var dateString = moment(dateDate).format('MM-YYYY');
            if (this.categories.indexOf(dateString) == -1) {
                this.categories.push(dateString);
            }
            //console.log("cat");
            //console.log(this.categories);
            // prep the immediate notifications
            var nResult = this.allResults[(n.id - 1)];
            if (nResult.result == 'now') {
                //console.log(this.categories.indexOf(dateString));
                var curValue = this.immediateNotifications[this.categories.indexOf(dateString)];
                if (curValue !== undefined) {
                    this.immediateNotifications[this.categories.indexOf(dateString)] = (curValue + 1);
                }
                else {
                    this.immediateNotifications[this.categories.indexOf(dateString)] = 1;
                }
            }
            else {
                var curValue = this.delayedNotifications[this.categories.indexOf(dateString)];
                if (curValue !== undefined) {
                    this.delayedNotifications[this.categories.indexOf(dateString)] = (curValue + 1);
                }
                else {
                    this.delayedNotifications[this.categories.indexOf(dateString)] = 1;
                }
            }
        }
        //console.log("now");
        //console.log(this.immediateNotifications);
        //console.log("delayed");
        //console.log(this.delayedNotifications);
    };
    /**
     * Get new subject rankings and refire using these params
     * in the callback - recalc the immediate/delayed notifications and set
     * to chart values
     *
     * @param category
     * @param value
     */
    ControlCmp.prototype.updatedate = function (category, value) {
        var _this = this;
        this.subjectRankings[category] = value;
        this.allResults = [];
        this.simService
            .getResultsForSubectAlert(this.user.id, this.alertParams, this.subjectRankings)
            .subscribe(function (result) {
            _this.allResults = result;
            _this.prepChart2Data();
            _this.chart.series[4].setData(_this.getImmediateNotifications());
            _this.chart.series[5].setData(_this.getDelayedNotifications());
        });
        /*
        this.chart.series[4].setData(this.getUpdatedImmediateNotifications(category, value));
        this.chart.series[5].setData(this.getUpdatedDelayedNotifications(category, value));*/
    };
    ControlCmp.prototype.updateChart2and3 = function () {
        var _this = this;
        this.allResults = [];
        this.simService
            .getResultsForSubectAlert(this.user.id, this.alertParams, this.subjectRankings)
            .subscribe(function (result) {
            _this.allResults = result;
            _this.prepChart2Data();
            _this.chart.series[4].setData(_this.getImmediateNotifications());
            _this.chart.series[5].setData(_this.getDelayedNotifications());
        });
    };
    ControlCmp.prototype.getSenderRankings = function (i) {
        var rankings = this.subjectRankings;
        var requiredRanking = [rankings[i]];
        return requiredRanking;
    };
    ControlCmp.prototype.getImmediateNotifications = function () {
        //call to fetch the data for the user and return as follows
        //return [null, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
        var arrayToReturn = [];
        arrayToReturn[0] = null;
        /*var i = 1;
        for(var val of this.categories){
          if(val !=null){
            arrayToReturn[i] = this.immediateNotifications[val]>0 || this.immediateNotifications[val]!== undefined
              ?this.immediateNotifications[val]:0;
          }
          i++;
        }*/
        var i = 1;
        for (var _i = 0, _a = this.immediateNotifications; _i < _a.length; _i++) {
            var val = _a[_i];
            if (val !== undefined) {
                arrayToReturn[i] = val;
            }
            else {
                arrayToReturn[i] = 0;
            }
            i++;
        }
        return arrayToReturn;
    };
    ControlCmp.prototype.getDelayedNotifications = function () {
        //call to fetch the data for the user and return as follows
        //return [null,  5.9, 6.5, 4.5, 8.2, 2.5, 5.2, 6.5, 3.3, 8.3, 3.9, 7.6];
        var arrayToReturn = [];
        arrayToReturn[0] = null;
        /*var i = 1;
         for(var val of this.categories){
         if(val !=null){
         arrayToReturn[i] = this.delayedNotifications[val]>0 || this.delayedNotifications[val]!== undefined
         ?this.delayedNotifications[val]:0;
         }
         i++;
         }*/
        var i = 1;
        for (var _i = 0, _a = this.delayedNotifications; _i < _a.length; _i++) {
            var val = _a[_i];
            if (val !== undefined) {
                arrayToReturn[i] = val;
            }
            else {
                arrayToReturn[i] = 0;
            }
            i++;
        }
        return arrayToReturn;
    };
    ControlCmp.prototype.getCategories = function () {
        /*var monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"];
         var arrayToReturn = ["Sender"];
         this.categories.sort();
         console.log(this.categories);
         for(var val of this.categories){
         arrayToReturn.push(monthNames[val]);
         }
         console.log('Array to return');
         console.log(arrayToReturn);
         return arrayToReturn;*/
        var arrayToReturn = [];
        arrayToReturn[0] = "Subject";
        var i = 1;
        for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
            var val = _a[_i];
            arrayToReturn[i] = val;
            i++;
        }
        return arrayToReturn;
    };
    ControlCmp.prototype.updatePointValue = function (point) {
        //console.log(this.chart1);
        var valueSubject = this.getSemanticValueFromQuantitative(this.chart1.series[3].data[0].y);
        var valueApp = this.getSemanticValueFromQuantitative(this.chart1.series[3].data[1].y);
        var valueSender = this.getSemanticValueFromQuantitative(this.chart1.series[3].data[2].y);
        if (point == 'Subject' || point == 'Application' || point == 'Sender') {
            var outputValueForRule = this.getOutputRuleForInputs(valueSender, valueSubject, valueApp);
            //console.log("Output rule value is: "+outputValueForRule);
            //console.log(this.alertParams[outputValueForRule]);
            var checkRule = this.alertParams[outputValueForRule];
            console.log(checkRule);
            if (checkRule == 'NOW') {
                this.chart1.series[3].data[3].y = 9;
            }
            else if (checkRule == 'BREAK' || checkRule == 'SOON') {
                this.chart1.series[3].data[3].y = 5;
            }
            else {
                this.chart1.series[3].data[3].y = 2;
            }
        }
        else {
            var outRuleValue = this.chart1.series[3].data[3].y;
            //console.log(outRuleValue);
            var indexRule = this.getOutputRuleForInputs(valueSender, valueSubject, valueApp);
            if (outRuleValue <= 3.33) {
                this.alertParams[indexRule] = "MUCHLATER";
            }
            else if (outRuleValue <= 6.66) {
                this.alertParams[indexRule] = "SOON";
            }
            else {
                this.alertParams[indexRule] = "NOW";
            }
            this.updateChart2and3();
        }
        console.log(this.alertParams);
        /*if (point == 'Subject') {
          this.getOutputRuleForInputs("NIP", "", "");
          this.point1 = value;
        } else if (point == 'Application') {
          this.point2 = value;
        } else if (point == 'Sender') {
          this.point3 = value;
        } else if (point == 'Output') {
          this.point4 = value;
        }*/
    };
    /**
     * Gets the semantic equivalent of the numeric value of series four on the
     * chart which is the rule value.
     * @param value
     * @returns {any}
     */
    ControlCmp.prototype.getSemanticValueFromQuantitative = function (value) {
        //console.log(value);
        if (value <= 3.33) {
            return 'NIP';
        }
        else if (value <= 6.66) {
            return 'IMPORTANT';
        }
        else {
            return 'VIP';
        }
    };
    ControlCmp.prototype.getPointValues = function () {
        alert('point 1:' + this.point1 + 'point 2:' + this.point2 + 'point 3:' + this.point3 + 'point 4:' + this.point4);
    };
    ControlCmp.prototype.getCategories31 = function () {
        //make a call to get this data from NAbs
        this.categories3 = ['Subject', 'Application', 'Sender', 'Output'];
        return this.categories3;
    };
    ControlCmp.prototype.getLineData = function () {
        // make a call to get this data from NAbs
        var output = 0;
        //console.log("get line data 2:");
        //console.log(this.alertParams);
        var val = this.getOutputRuleForInputs(this.getSemanticValueFromQuantitative(5), this.getSemanticValueFromQuantitative(3), this.getSemanticValueFromQuantitative(8));
        if (this.alertParams[val] == "NOW") {
            output = 2;
        }
        if (this.alertParams[val] == "SOON" || this.alertParams[val] == "VERYSOON") {
            output = 4;
        }
        else {
            output = 8;
        }
        //console.log(output);
        this.data3 = [3, 5, 8, output];
        return this.data3;
    };
    ControlCmp.prototype.getStackData = function () {
        //make a call to get this data from NAbs
        this.data3 = [3.33, 3.33, 3.33, 3.33];
        return this.data3;
    };
    ControlCmp.prototype.getImmediateNotificationData = function () {
        return [26.857, 27, 27.111, 27.2, 27.272, 30.545, 32.181, 33.818, 35.272, 36.545, 37.818, 41.818, 44.545, 47.272, 48.545, 49.818, 53.545, 61, 64.909, 68.818, 72.727, 75.09, 77.454, 82.181, 84.545, 84.454, 86.181, 87.909, 89.636, 93.09, 96.727, 100.363, 104, 107.636, 111.272, 116.727, 121.09, 125.454, 129.818, 134.181, 136.727, 151.636, 159.09, 166.545, 174, 181.454, 186.363, 201.636, 209.272, 216.909, 222.818, 228.727, 234.636, 249.363, 258.181, 267, 273.09, 279.181, 288.181, 303, 308.818, 314.636, 326.909, 336.272, 345.636, 364.363, 373.727, 380.181, 389.818, 399.454, 409.09, 425.727, 432.727, 439.727, 446.727, 453.727, 460.727, 473.272, 478.818, 484.363, 489.909, 491.636, 493.363, 498.272, 500.727, 503.181, 506.454, 508, 509.545, 512.636, 514.363, 516.09, 517.909, 519.727, 521.545, 525.636, 527.272, 528.909, 529.636, 530.363, 530.909, 531.181, 531.3, 531.444, 530.75, 529.857, 528.666, 521, 521, 521.777, 522.4, 522.909, 522.818, 522.636, 522.545, 522.454, 522.363, 522.272, 522.181, 520.727, 520.545, 521.09, 521.636, 522.181, 523.272, 523.818, 524.363, 524.909, 525.454, 528.09, 532.272, 534.363, 536.454, 537.909, 539.363, 540.818, 543.727, 545.909, 544.818, 543.727, 542.636, 541.545, 540, 539.545, 539.09, 538.636, 537.272, 535.181, 533.363, 532.454, 531.545, 530.636, 529.727, 528.818, 526.272, 525.909, 525.545, 525.181, 524.818, 524.454, 523.727, 522.363, 521, 520, 519, 516.545, 511.636, 510.636, 509.636, 506.909, 504.181, 502.454, 499, 497.272, 497, 496.727, 497.454, 496.727, 493.818, 491.636, 489.454, 487.272, 487.09, 486.909, 486.545, 485.363, 484.181, 484.09, 481.545, 479, 478.181, 477.909, 477.636, 477.363, 477.09, 476.818, 476.363, 481.818, 487.272, 492.727, 493.909, 493.181, 491.727, 491, 490.272, 489.545, 487.636, 485.727, 482.363, 474.454, 468.454, 462.454, 456.454, 450.454, 439.727, 435, 430.272, 425.545, 418.727, 418.363, 418.545, 419.09, 419.636, 420.181, 419.454, 418.727, 413.818, 413, 412.181, 411.363, 409.636, 407.909, 405, 403.818, 397.454, 392.818, 388.181, 383.545, 374.272, 369.636, 365, 358.363, 351.181, 344, 340, 338, 336, 334, 332, 328.636, 323.909, 322.545, 321.181, 319.818, 318.272, 315.181, 313.636, 312.09, 311.909, 311.727, 310.545, 308.181, 307, 306, 305, 302.818, 300.636, 297.545, 296.636, 296.727, 296.181, 295.636, 295.09, 294, 294.636, 293.09, 291.545, 291.545, 291.545, 292.181, 292.818, 293.454, 294.09, 292.545, 291, 292.272, 292.363, 292.454, 292.545, 289.818, 287.09, 281.636, 281.09, 280.545, 277, 273.454, 271.454, 267.454, 265.181, 262.909, 260.636, 258.363, 256.09, 248.909, 246.818, 240.909, 235, 229.09, 226.272, 220.636, 217.818, 215, 215, 211.545, 208.09, 201.181, 197.727, 194.272, 190.818, 187.363, 183.909, 170.818, 173, 175.181, 177.363, 179.545, 181.727, 186.09, 182.727, 179.363, 179.09, 178.818, 173.272, 160.272, 152.818, 145.363, 137.909, 130.454, 126.818, 116.272, 111, 107.363, 101.909, 98.363, 94.818, 87, 82.818, 80.363, 79.545, 78.272, 77, 73, 71.454, 69.636, 67.909, 66.727, 65.454, 62.909, 62.09, 61.272, 60.363, 59.454, 59, 58.545, 58.272, 58.09, 57.909, 57.727, 57.545, 57.272, 57.181, 56.909, 56.636, 56.454, 56.272, 55.909, 55.727, 55.818, 55.545, 55.272, 54.909, 54.818, 54.727, 54.636, 54.545, 54.454, 54, 54, 54, 54, 54, 53.636, 52.909, 52.545, 52.636, 52.727, 52.818, 52.909, 52.636, 52.272, 52.272, 52.272, 52.272, 52.818, 53, 53.09, 53.181, 53.272, 53.818, 54.363, 55.09, 55.454, 55.272, 55.09, 54.909, 54.727, 54.363, 53.727, 53.09, 52.636, 52.181, 51.727, 50.818, 50.363, 50.363, 50.363, 50.363, 50.818, 51.727, 51.272, 50.818, 50.363, 50.636, 50.909, 50.545, 50.363, 50.181, 50, 49.818, 50.818, 52.818, 53.09, 53.363, 53.636, 53.909, 54.181, 53.272, 52.818, 52.09, 51.363, 50.636, 49.909, 47.818, 46.09, 44.363, 43.363, 42.363, 41.363, 39.363, 37.636, 35.909, 35.181, 35.09, 35.363, 35.909, 36.181, 36.545, 36.909, 37.272, 38.363, 39.545, 39.636, 39.727, 39.818, 38.636, 37.454, 34.909, 33.636, 32.363, 31.09, 29.818, 27.181, 21.909, 20.545, 19.181, 17.818, 16.454, 15.09, 10.727, 8.545, 8.636, 8.727, 8.818, 8.909, 9.09, 8.9, 8.666, 9.5, 10.571, 12];
    };
    ControlCmp.prototype.getDelayedNotificationData = function () {
        return [101, 98, 103, 115, 124, 128, 133, 138, 138, 141, 143, 149, 149, 148, 146, 147, 152, 149, 155, 152, 153, 153, 156, 152, 151, 151, 149, 148, 150, 157, 161, 156, 160, 158, 156, 159, 164, 162, 160, 165, 165, 167, 167, 163, 166, 165, 161, 164, 163, 164, 162, 163, 164, 166, 166, 166, 166, 166, 164, 167, 166, 162, 164, 163, 161, 166, 168, 168, 169, 169, 165, 166, 167, 163, 167, 167, 169, 171, 167, 169, 171, 175, 174, 167, 168, 171, 167, 169, 169, 167, 166, 165, 163, 161, 163, 166, 162, 164, 166, 162, 162, 164, 163, 162, 162, 163, 161, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 113, 117, 121, 119, 117, 120, 121, 124, 125, 127, 125, 129, 130, 131, 135, 135, 135, 135, 134, 136, 139, 142, 142, 145, 145, 150, 153, 155, 156, 157, 157, 154, 153, 152, 148, 130, 123, 123, 120, 123, 119, 115, 114, 114, 115, 115, 113, 112, 111, 113, 113, 113, 113, 110, 110, 109, 110, 110, 109, 108, 108, 109, 107, 107, 107, 109, 109, 111, 111, 111, 111, 111, 112, 112, 112, 112, 112, 114, 113, 113, 113, 113, 113, 113, 112, 111, 114, 118, 124, 127, 128, 128, 129, 131, 133, 131, 130, 133, 130, 136, 135, 135, 136, 136, 135, 136, 135, 134, 135, 137, 138, 139, 138, 134, 130, 130, 129, 129, 132, 132, 131, 130, 133, 132, 132, 128, 128, 132, 132, 128, 128, 129, 130, 130, 130, 130, 131, 133, 134, 132, 132, 130, 131, 129, 133, 133, 130, 130, 133, 133, 131, 130, 130, 130, 129, 129, 129, 126, 128, 126, 129, 129, 124, 125, 120, 120, 123, 125, 125, 124, 124, 125, 125, 126, 126, 126, 127, 126, 130, 134, 135, 126, 123, 124, 123, 127, 130, 130, 132, 133, 133, 133, 133, 130, 130, 129, 128, 124, 123, 124, 124, 127, 135, 139, 139, 134, 134, 133, 130, 130, 127, 129, 126, 126, 126, 129, 129, 123, 123, 128, 128, 125, 125, 125, 123, 123, 122, 122, 122, 125, 125, 125, 126, 126, 128, 128, 129, 129, 124, 125, 125, 125, 129, 131, 131, 131, 131, 131, 131, 131, 129, 129, 126, 126, 126, 126, 126, 125, 125, 126, 126, 126, 125, 126, 127, 130, 130, 130, 130, 132, 132, 132, 132, 132, 132, 129, 130, 132, 133, 132, 132, 129, 128, 128, 132, 133, 135, 137, 138, 139, 139, 142, 142, 141, 143, 144, 144, 143, 145, 145, 147, 150, 153, 158, 159, 160, 159, 160, 160, 160, 162, 162, 163, 162, 161, 161, 162, 161, 164, 166, 166, 165, 162, 162, 159, 157, 160, 159, 160, 160, 161, 161, 162, 162, 163, 163, 165, 166, 166, 164, 164, 166, 165, 166, 163, 162, 162, 161, 159, 159, 159, 159, 159, 156, 154, 153, 152, 152, 151, 154, 153, 151, 151];
    };
    ControlCmp.prototype.getUpdatedImmediateNotificationData = function (point, value) {
        return [556.857, 167, 227.111, 177.2, 227.272, 330.545, 312.181, 133.818, 135.272, 136.545, 137.818, 141.818, 144.545, 147.272, 248.545, 249.818, 253.545, 261, 64.909, 268.818, 72.727, 75.09, 77.454, 82.181, 84.545, 84.454, 86.181, 87.909, 89.636, 93.09, 96.727, 100.363, 104, 107.636, 111.272, 116.727, 121.09, 125.454, 129.818, 134.181, 136.727, 151.636, 159.09, 166.545, 174, 181.454, 186.363, 201.636, 209.272, 216.909, 222.818, 228.727, 234.636, 249.363, 258.181, 267, 273.09, 279.181, 288.181, 303, 308.818, 314.636, 326.909, 336.272, 345.636, 364.363, 373.727, 380.181, 389.818, 399.454, 409.09, 425.727, 432.727, 439.727, 446.727, 453.727, 460.727, 473.272, 478.818, 484.363, 489.909, 491.636, 493.363, 498.272, 500.727, 503.181, 506.454, 508, 509.545, 512.636, 514.363, 516.09, 517.909, 519.727, 521.545, 525.636, 527.272, 528.909, 529.636, 530.363, 530.909, 531.181, 531.3, 531.444, 530.75, 529.857, 528.666, 521, 521, 521.777, 522.4, 522.909, 522.818, 522.636, 522.545, 522.454, 522.363, 522.272, 522.181, 520.727, 520.545, 521.09, 521.636, 522.181, 523.272, 523.818, 524.363, 524.909, 525.454, 528.09, 532.272, 534.363, 536.454, 537.909, 539.363, 540.818, 543.727, 545.909, 544.818, 543.727, 542.636, 541.545, 540, 539.545, 539.09, 538.636, 537.272, 535.181, 533.363, 532.454, 531.545, 530.636, 529.727, 528.818, 526.272, 525.909, 525.545, 525.181, 524.818, 524.454, 523.727, 522.363, 521, 520, 519, 516.545, 511.636, 510.636, 509.636, 506.909, 504.181, 502.454, 499, 497.272, 497, 496.727, 497.454, 496.727, 493.818, 491.636, 489.454, 487.272, 487.09, 486.909, 486.545, 485.363, 484.181, 484.09, 481.545, 479, 478.181, 477.909, 477.636, 477.363, 477.09, 476.818, 476.363, 481.818, 487.272, 492.727, 493.909, 493.181, 491.727, 491, 490.272, 489.545, 487.636, 485.727, 482.363, 474.454, 468.454, 462.454, 456.454, 450.454, 439.727, 435, 430.272, 425.545, 418.727, 418.363, 418.545, 419.09, 419.636, 420.181, 419.454, 418.727, 413.818, 413, 412.181, 411.363, 409.636, 407.909, 405, 403.818, 397.454, 392.818, 388.181, 383.545, 374.272, 369.636, 365, 358.363, 351.181, 344, 340, 338, 336, 334, 332, 328.636, 323.909, 322.545, 321.181, 319.818, 318.272, 315.181, 313.636, 312.09, 311.909, 311.727, 310.545, 308.181, 307, 306, 305, 302.818, 300.636, 297.545, 296.636, 296.727, 296.181, 295.636, 295.09, 294, 294.636, 293.09, 291.545, 291.545, 291.545, 292.181, 292.818, 293.454, 294.09, 292.545, 291, 292.272, 292.363, 292.454, 292.545, 289.818, 287.09, 281.636, 281.09, 280.545, 277, 273.454, 271.454, 267.454, 265.181, 262.909, 260.636, 258.363, 256.09, 248.909, 246.818, 240.909, 235, 229.09, 226.272, 220.636, 217.818, 215, 215, 211.545, 208.09, 201.181, 197.727, 194.272, 190.818, 187.363, 183.909, 170.818, 173, 175.181, 177.363, 179.545, 181.727, 186.09, 182.727, 179.363, 179.09, 178.818, 173.272, 160.272, 152.818, 145.363, 137.909, 130.454, 126.818, 116.272, 111, 107.363, 101.909, 98.363, 94.818, 87, 82.818, 80.363, 79.545, 78.272, 77, 73, 71.454, 69.636, 67.909, 66.727, 65.454, 62.909, 62.09, 61.272, 60.363, 59.454, 59, 58.545, 58.272, 58.09, 57.909, 57.727, 57.545, 57.272, 57.181, 56.909, 56.636, 56.454, 56.272, 55.909, 55.727, 55.818, 55.545, 55.272, 54.909, 54.818, 54.727, 54.636, 54.545, 54.454, 54, 54, 54, 54, 54, 53.636, 52.909, 52.545, 52.636, 52.727, 52.818, 52.909, 52.636, 52.272, 52.272, 52.272, 52.272, 52.818, 53, 53.09, 53.181, 53.272, 53.818, 54.363, 55.09, 55.454, 55.272, 55.09, 54.909, 54.727, 54.363, 53.727, 53.09, 52.636, 52.181, 51.727, 50.818, 50.363, 50.363, 50.363, 50.363, 50.818, 51.727, 51.272, 50.818, 50.363, 50.636, 50.909, 50.545, 50.363, 50.181, 50, 49.818, 50.818, 52.818, 53.09, 53.363, 53.636, 53.909, 54.181, 53.272, 52.818, 52.09, 51.363, 50.636, 49.909, 47.818, 46.09, 44.363, 43.363, 42.363, 41.363, 39.363, 37.636, 35.909, 35.181, 35.09, 35.363, 35.909, 36.181, 36.545, 36.909, 37.272, 38.363, 39.545, 39.636, 39.727, 39.818, 38.636, 37.454, 34.909, 33.636, 32.363, 31.09, 29.818, 27.181, 21.909, 20.545, 19.181, 17.818, 16.454, 15.09, 10.727, 8.545, 8.636, 8.727, 8.818, 8.909, 9.09, 8.9, 8.666, 9.5, 10.571, 12];
    };
    ControlCmp.prototype.getUpdatedDelayedNotificationData = function (point, value) {
        return [88, 77, 44, 34, 124, 128, 133, 138, 138, 141, 143, 149, 149, 148, 146, 147, 152, 149, 155, 152, 153, 153, 156, 152, 151, 151, 149, 148, 150, 157, 161, 156, 160, 158, 156, 159, 164, 162, 160, 165, 165, 167, 167, 163, 166, 165, 161, 164, 163, 164, 162, 163, 164, 166, 166, 166, 166, 166, 164, 167, 166, 162, 164, 163, 161, 166, 168, 168, 169, 169, 165, 166, 167, 163, 167, 167, 169, 171, 167, 169, 171, 175, 174, 167, 168, 171, 167, 169, 169, 167, 166, 165, 163, 161, 163, 166, 162, 164, 166, 162, 162, 164, 163, 162, 162, 163, 161, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 113, 117, 121, 119, 117, 120, 121, 124, 125, 127, 125, 129, 130, 131, 135, 135, 135, 135, 134, 136, 139, 142, 142, 145, 145, 150, 153, 155, 156, 157, 157, 154, 153, 152, 148, 130, 123, 123, 120, 123, 119, 115, 114, 114, 115, 115, 113, 112, 111, 113, 113, 113, 113, 110, 110, 109, 110, 110, 109, 108, 108, 109, 107, 107, 107, 109, 109, 111, 111, 111, 111, 111, 112, 112, 112, 112, 112, 114, 113, 113, 113, 113, 113, 113, 112, 111, 114, 118, 124, 127, 128, 128, 129, 131, 133, 131, 130, 133, 130, 136, 135, 135, 136, 136, 135, 136, 135, 134, 135, 137, 138, 139, 138, 134, 130, 130, 129, 129, 132, 132, 131, 130, 133, 132, 132, 128, 128, 132, 132, 128, 128, 129, 130, 130, 130, 130, 131, 133, 134, 132, 132, 130, 131, 129, 133, 133, 130, 130, 133, 133, 131, 130, 130, 130, 129, 129, 129, 126, 128, 126, 129, 129, 124, 125, 120, 120, 123, 125, 125, 124, 124, 125, 125, 126, 126, 126, 127, 126, 130, 134, 135, 126, 123, 124, 123, 127, 130, 130, 132, 133, 133, 133, 133, 130, 130, 129, 128, 124, 123, 124, 124, 127, 135, 139, 139, 134, 134, 133, 130, 130, 127, 129, 126, 126, 126, 129, 129, 123, 123, 128, 128, 125, 125, 125, 123, 123, 122, 122, 122, 125, 125, 125, 126, 126, 128, 128, 129, 129, 124, 125, 125, 125, 129, 131, 131, 131, 131, 131, 131, 131, 129, 129, 126, 126, 126, 126, 126, 125, 125, 126, 126, 126, 125, 126, 127, 130, 130, 130, 130, 132, 132, 132, 132, 132, 132, 129, 130, 132, 133, 132, 132, 129, 128, 128, 132, 133, 135, 137, 138, 139, 139, 142, 142, 141, 143, 144, 144, 143, 145, 145, 147, 150, 153, 158, 159, 160, 159, 160, 160, 160, 162, 162, 163, 162, 161, 161, 162, 161, 164, 166, 166, 165, 162, 162, 159, 157, 160, 159, 160, 160, 161, 161, 162, 162, 163, 163, 165, 166, 166, 164, 164, 166, 165, 166, 163, 162, 162, 161, 159, 159, 159, 159, 159, 156, 154, 153, 152, 152, 151, 154, 153, 151, 151];
    };
    ControlCmp.prototype.updateNotifications31 = function (point, value) {
        this.chart2.series[0].setData(this.getUpdatedImmediateNotificationData(point, value));
        this.chart3.series[0].setData(this.getUpdatedDelayedNotificationData(point, value));
    };
    ControlCmp.prototype.getOutputRuleForInputs = function (senderImp, subjectImp, appImp) {
        var senderArray = [];
        senderArray.push(sim_cmp_1.SimCmp.alertSenderInputValues.indexOf(senderImp));
        while (senderArray[senderArray.length - 1] !== -1) {
            senderArray.push(sim_cmp_1.SimCmp.alertSenderInputValues.indexOf(senderImp, senderArray[senderArray.length - 1] + 1));
        }
        var subjectArray = [];
        subjectArray.push(sim_cmp_1.SimCmp.alertSubjectInputValues.indexOf(subjectImp));
        while (subjectArray[subjectArray.length - 1] !== -1) {
            subjectArray.push(sim_cmp_1.SimCmp.alertSubjectInputValues.indexOf(subjectImp, subjectArray[subjectArray.length - 1] + 1));
        }
        var appArray = [];
        appArray.push(sim_cmp_1.SimCmp.alertAppInputValues.indexOf(appImp));
        while (appArray[appArray.length - 1] !== -1) {
            appArray.push(sim_cmp_1.SimCmp.alertAppInputValues.indexOf(appImp, appArray[appArray.length - 1] + 1));
        }
        senderArray.splice(-1);
        subjectArray.splice(-1);
        appArray.splice(-1);
        // check if any index common across all three arrays and save that index
        //console.log(senderArray);
        //console.log(subjectArray);
        //console.log(appArray);
        var commonIndices = [];
        for (var i = 0; i < 27; i++) {
            if (senderArray.indexOf(i) !== -1 && subjectArray.indexOf(i) !== -1 && appArray.indexOf(i) !== -1) {
                commonIndices.push(i);
            }
        }
        return commonIndices;
    };
    /** End of chart 3 stuff
     */
    /**
     * Prepares the event data surrounding a notification for
     * inclusion in the bar chart. i.e. counts how many of the
     * events are relevant to the notification attribute.
     * @returns {any}
     */
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
     * Evaluate the notification by changing the ranking for
     * user stipulated notification attribute.
     * If the change in ranking meets the user's preference (sooner
     * or later than original result) then finish and present the result.
     * If the ranking value hits the ground or the ceiling - decide which
     * other attribute may change the delivery to suit the user's needs.
     * Present the user with the findings.
     */
    ControlCmp.prototype.runChanges = function () {
        var _this = this;
        this.highlight = '';
        if (!this.finished) {
            if (this.deliveryDirection == 'sooner') {
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
            this.simService
                .getResultForChangeDelivery(this.user.id, this.selectedNotification.id, this.params, this.notificationFeature, this.currentRanking)
                .subscribe(function (result) {
                if (_this.originalResult != result.result) {
                    _this.finished = true;
                }
                setTimeout(function () {
                    this.updateUI(result.result);
                }.bind(_this), 2000);
            });
        }
        else {
            this.finished = false;
            this.finishedReason = null;
        }
    };
    /**
     * Updates the selectedNotification value so the changes
     * are reflected in the table the user is viewing.
     * @param ranking - the notification attribute value which is being
     * updated
     */
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
    };
    /**
     * Update the graphs with the current iteration of "runChanges" values.
     * @param result - the new delivery result for this notification.
     */
    ControlCmp.prototype.updateUI = function (result) {
        this.updateSelectedNotification(this.currentRanking);
        var i = this.labels.indexOf(this.notificationFeature);
        var resultRanking = (this.rankingValues.indexOf(result) * 2) + 2;
        this.resultGraph.series[0].data[i].update(this.currentRanking);
        this.resultGraph.series[0].data[3].update(resultRanking);
        this.runChanges();
        this.newResult = result;
        /*this.highlight = this.notificationFeature;
        this.wobbleState = "active";*/
    };
    ControlCmp.prototype.reset = function () {
        var _this = this;
        this.zone.run(function () {
            _this.wobbleState = "inactive";
        });
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
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ControlCmp.prototype, "controlType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ControlCmp.prototype, "allResults", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ControlCmp.prototype, "alertParams", void 0);
ControlCmp = __decorate([
    core_1.Component({
        selector: "control-cmp",
        templateUrl: "sim/templates/control.html",
        styleUrls: ["sim/styles/control.css"],
        animations: [
            core_1.trigger('tada', [
                core_1.transition('inactive => active', core_1.animate(1000, core_1.keyframes([
                    core_1.style({ transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15 }),
                    core_1.style({ transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30 }),
                    core_1.style({ transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45 }),
                    core_1.style({ transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60 }),
                    core_1.style({ transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75 }),
                    core_1.style({ transform: 'none', offset: 1 }),
                ]))),
            ])
        ]
    }),
    __metadata("design:paramtypes", [sim_service_1.SimService, core_1.NgZone])
], ControlCmp);
exports.ControlCmp = ControlCmp;
