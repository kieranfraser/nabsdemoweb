/**
 * Created by kfraser on 28/04/2017.
 */
alert('Javascript running');

new RGraph.SVG.Line({
  id: 'chart-container',
  data: [5,8,6,3,4,1,9,8,2,3,5,6,7,8,9,4,5,6,3,2,5,4,8,6,4,5,3,1,6,4,5],
  options: {
    backgroundGridVlinesCount: 11,
    hmargin: 0,
    textColor: 'white',
    textSize: 14,
    textFont: 'Verdana',
    filled: true,
    filledColors: ['rgba(25,51,74,0.75)'],
    colors: ['#5AF'],
    gutterLeft: 65,
    gutterRight: 40,
    gutterBottom: 50,
    gutterTop: 20,
    xaxis: false,
    yaxis: false,
    yaxisUnitsPost: 'm',
    yaxisUnitsPre: '$',
    tickmarksStyle: 'circle',
    tickmarksFill: 'black',
    tickmarksLinewidth: 2,
    tickmarksSize: 6,
    linewidth: 4,
    spline: true,
    xaxisLabels: ['Kev','John','Fred','July','Fred','Olga','Ben','Boris','Lenny','Pete','Lewis']
  }
}).trace();

