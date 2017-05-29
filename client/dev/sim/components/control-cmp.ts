/**
 * Created by Kieran on 24/05/2017.
 */
import {
  Component,
  OnInit, Input, AfterViewInit, style, keyframes, animate, transition, trigger, NgZone
} from "@angular/core";
import {SimService} from "../services/sim-service";

declare var RGraph: any;
declare var Highcharts: any;

@Component({
  selector: "control-cmp",
  templateUrl: "sim/templates/control.html",
  styleUrls: ["sim/styles/control.css"],
  animations: [
    trigger('tada', [
      transition('inactive => active', animate(1000, keyframes([
        style({transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15}),
        style({transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30}),
        style({transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45}),
        style({transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60}),
        style({transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75}),
        style({transform: 'none', offset: 1}),
      ]))),
    ])
  ]
})
export class ControlCmp implements OnInit, AfterViewInit {

  @Input() labels:string[];
  @Input() data:number[];
  @Input() selectedNotification:any;
  @Input() user:any;
  @Input() deliveryDirection:string;
  @Input() notificationFeature:string;
  @Input() notificationEvents:any;
  @Input() result:string;
  @Input() params: string[];
  @Input() controlType: string;

  private rankingValues = ['much later', 'later', 'soon', 'very soon', 'now'];
  private finishedReason = null;

  private originalResult = null;
  private originalNotification = null;
  private newResult = null;
  private currentRanking = null;

  private finished = false;

  private resultGraph = null;
  private chart = null;

  private highlight = '';
  private wobbleState: string;

  constructor(private simService: SimService, public zone: NgZone){}

  ngOnInit(){
    this.finishedReason = null;
    this.originalResult = this.result;
    this.originalNotification = this.selectedNotification;
    this.getRankingsFromNotification();
    var i = this.labels.indexOf(this.notificationFeature);
    this.currentRanking = this.data[i];
  }

  /**
   * Initialize the charts once the view appears.
   */
  ngAfterViewInit(){


    if(this.controlType == '1') {
      this.initCharts1();
    }
    if(this.controlType == '2') {
      this.prepChart2Data();
      this.initCharts2();
    }
  }

  /**
   * Get the ranking values and add them to the data array to be
   * passed to the charts. The resultRanking is calculated based on
   * it's position in the rankingValues array (which is ordinal).
   */
  getRankingsFromNotification(){
    if(this.selectedNotification != null){
      var resultRanking = (this.rankingValues.indexOf(this.originalResult) * 2) + 2;
      this.data = [this.selectedNotification.senderRank, this.selectedNotification.subjectRank, this.selectedNotification.appRank, resultRanking];
    }
  }

  /**
   * Chart options
   */
  initCharts1(){
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
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
      });

  }

  /**
   * Subject Ranking chart
   */
  initCharts2(){
    this.chart = Highcharts.chart('container-ranking', {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Notification Delivery Control'
      },

      xAxis: [{
        categories: (function() { return this.getCategories();}.bind(this))(),
        crosshair: true
      }],
      yAxis: [{ // Primary yAxis
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

      }, { // Secondary yAxis
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
                this.updatedate(this.category, e.y);
              }.bind(this)
            }
          },
          stickyTracking: false
        }
      },

      series: [{
        name: 'Family',
        type: 'column',
        yAxis: 1,
        data: (function() { return this.getSenderRankings(0);}.bind(this))(),
        draggableY: true,
        yDecimals: 0,
        dragPrecisionY: 1,
        dragMinY: 0


      }, {
        name: 'Friends',
        type: 'column',
        yAxis: 1,
        data: (function() { return this.getSenderRankings(1);}.bind(this))(),
        draggableY: true,
        yDecimals: 0,
        dragPrecisionY: 1,
        dragMinY: 0

      },
        {
          name: 'colleagues',
          type: 'column',
          yAxis: 1,
          data: (function() { return this.getSenderRankings(2);}.bind(this))(),
          draggableY: true,
          yDecimals: 0,
          dragPrecisionY: 1,
          dragMinY: 0

        }, {
          name: 'Stranger',
          type: 'column',
          yAxis: 1,
          data: (function() { return this.getSenderRankings(3);}.bind(this))(),
          draggableY: true,
          yDecimals: 0,
          dragPrecisionY: 1,
          dragMinY: 0

        },{
          name: 'Immediate Notifications',
          type: 'spline',
          data: (function() { return this.getImmediateNotifications();}.bind(this))(),
          tooltip: {
            valueSuffix: ' Notifications'
          }
        },
        {
          name: 'Notifications delayed',
          type: 'spline',
          data: (function() { return this.getDelayedNotifications();}.bind(this))(),
          tooltip: {
            valueSuffix: ' Notifications'
          }
        }]
    });
  }

  private categories = [];
  private subjectRankings = [];
  private immediateNotifications = [];
  private delayedNotifications = [];


  prepChart2Data(){
    console.log(this.user);
    for(var n of this.user.notifications){
      var d = new Date.parse(n.date);
      console.log(d.getMonth());
    }
  }

  /**
   * Get new subject rankings and refire using these params
   * in the callback - recalc the immediate/delayed notifications and set
   * to chart values
   *
   * @param category
   * @param value
   */
  updatedate(category, value) {
    this.chart.series[4].setData(this.getUpdatedImmediateNotifications(category, value));
    this.chart.series[5].setData(this.getUpdatedDelayedNotifications(category, value));
  }

  getSenderRankings(i) {
  var rankings = [9, 7, 5, 2];
  var requiredRanking = [rankings[i]];
  return requiredRanking;
}

  getImmediateNotifications() {
    //call to fetch the data for the user and return as follows
    return [null, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
  }

  getDelayedNotifications() {
    //call to fetch the data for the user and return as follows
    return [null,  5.9, 6.5, 4.5, 8.2, 2.5, 5.2, 6.5, 3.3, 8.3, 3.9, 7.6];
  }



  /**
   * Gets the months over the span of total notifications.
   * @returns {string[]}
     */
  getCategories() {
    return ['Subject', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }


  getUpdatedImmediateNotifications(senderType, value) {
    //update the ranking and fetch the new data for the user and return as follows
    return [null, 16.9, 19.5, 24.5, 28.2, 31.5, 35.2, 36.5, 33.3, 28.3, 23.9, 19.6];
  }

  getUpdatedDelayedNotifications(senderType, value) {
    //update the ranking and fetch the new data for the user and return as follows
    return [null,  4.9, 16.5, 17.5, 18.2, 2.5, 15.2, 26.5, 13.3, 5.3, 1.9, 17.6];
  }

  /**
   * Prepares the event data surrounding a notification for
   * inclusion in the bar chart. i.e. counts how many of the
   * events are relevant to the notification attribute.
   * @returns {any}
   */
  prepEventData() {
    var senderCount = 0;
    var subjectCount = 0;
    if(this.notificationEvents != null){
      for(var e of this.notificationEvents){
        if(e.description.indexOf(this.selectedNotification.subject.subject) > -1){
          subjectCount++;
        }
        if(e.description.indexOf(this.selectedNotification.sender) > -1){
          senderCount++;
        }
      }
      return [senderCount, subjectCount];
    }
    else return [0,0]
  }

  /**
   * Evaluate the notification by changing the ranking for
   * user stipulated notification attribute.
   * If the change in ranking meets the user's preference (sooner
   * or later than original result) then finish and present the result.
   * If the ranking value hits the ground or the ceiling - decide which
   * other attribute may change the delivery to suit the user's needs.
   * Present the user with the findings.
   */
  runChanges(){
    this.highlight = '';
    if(!this.finished){

      if(this.deliveryDirection == 'sooner'){

        var checkSooner = this.currentRanking + 1;
        if(checkSooner <10){
          this.currentRanking += 1;
        }
        if(checkSooner >= 10){
          this.currentRanking = 10;
          this.finished = true;
          this.finishedReason = "The ranking value for "+this.notificationFeature+" is at its lowest";
          this.finished = true;
        }
      }
      else{

        var checkLater = this.currentRanking - 1;
        if(checkLater > 1){
          this.currentRanking -= 1;
        }
        if(checkLater <= 1){
          this.currentRanking = 1;
          this.finishedReason = "The ranking value for "+this.notificationFeature+" is at its lowest";
          this.finished = true;
        }
      }
      this.simService
        .getResultForChangeDelivery(this.user.id, this.selectedNotification.id, this.params, this.notificationFeature,
          this.currentRanking)
        .subscribe((result)=> {
          if(this.originalResult != result.result){
            this.finished = true;
          }
          setTimeout(function () {
            this.updateUI(result.result);
          }.bind(this), 2000);
        });

    }
    else{
      this.finished = false;
      this.finishedReason = null;
    }
  }

  /**
   * Updates the selectedNotification value so the changes
   * are reflected in the table the user is viewing.
   * @param ranking - the notification attribute value which is being
   * updated
   */
  updateSelectedNotification(ranking:number){
    switch(this.notificationFeature){
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
  }

  /**
   * Update the graphs with the current iteration of "runChanges" values.
   * @param result - the new delivery result for this notification.
   */
  updateUI(result: string){
    this.updateSelectedNotification(this.currentRanking);
    var i = this.labels.indexOf(this.notificationFeature);
    var resultRanking = (this.rankingValues.indexOf(result) * 2) + 2;
    this.resultGraph.series[0].data[i].update(this.currentRanking);
    this.resultGraph.series[0].data[3].update(resultRanking);
    this.runChanges();
    this.newResult = result;
    /*this.highlight = this.notificationFeature;
    this.wobbleState = "active";*/
  }

  reset() {
    this.zone.run(() => {
      this.wobbleState = "inactive";
    });
  }
}
