/**
 * Created by Kieran on 24/05/2017.
 */
import {
  Component,
  OnInit, Input, AfterViewChecked, AfterViewInit
} from "@angular/core";
import {SimService} from "../services/sim-service";

declare var RGraph: any;
declare var Highcharts: any;

@Component({
  selector: "control-cmp",
  templateUrl: "sim/templates/control.html",
  styleUrls: ["sim/styles/control.css"]
})
export class ControlCmp implements OnInit, AfterViewChecked, AfterViewInit {

  @Input() labels:string[];
  @Input() data:number[];
  @Input() selectedNotification:any;
  @Input() user:any;
  @Input() deliveryDirection:string;
  @Input() notificationFeature:string;
  @Input() notificationEvents:any;
  @Input() result:string;
  @Input() params: string[];

  private rankingValues = ['now', 'very soon', 'soon', 'later', 'much later'];
  private finishedReason = null;

  private originalResult = null;
  private originalNotification = null;
  private newResult = null;
  private currentRanking = null;

  private finished = false;

  private resultGraph = null;

  constructor(private simService: SimService){}

  ngOnInit(){
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
  }

  ngAfterViewChecked(){}

  ngAfterViewInit(){
    this.svgGraph();
  }

  getRankingsFromNotification(){
    if(this.selectedNotification != null){
      var resultRanking = (this.rankingValues.indexOf(this.originalResult) * 2) + 2;
      this.data = [this.selectedNotification.senderRank, this.selectedNotification.subjectRank, this.selectedNotification.appRank, resultRanking];
    }
  }
  /**
   * Initialization of the interactive graph
   */
  svgGraph(){
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
   * Run changes to the notification until the desired value is met.
   */
  runChanges(){
    console.log("in run changes");
    if(!this.finished){

      console.log("in loop");

      console.log("current ranking: "+this.currentRanking);
      if(this.deliveryDirection == 'sooner'){

        console.log("in sooner");
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
        console.log("in later");
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
      this.updateSelectedNotification(this.currentRanking);

      console.log("in finishedReason");
      this.simService
        .getResultForChangeDelivery(this.user.id, this.selectedNotification.id, this.params, this.notificationFeature,
          this.currentRanking)
        .subscribe((result)=> {
          this.newResult = result.result;
          if(this.originalResult != result.result){
            this.finished = true;
          }
          this.runChanges();
        });

    }
    else{
      this.finished = false;
      this.finishedReason = null;
      console.log("final ranking "+this.currentRanking);
    }
  }

  checkFinished(){}

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
    setTimeout(function () {
      this.svgGraph();
    }.bind(this), 2000);
  }
}
