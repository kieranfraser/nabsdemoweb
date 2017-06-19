/**
 * Created by Kieran on 29/05/2017.
 */

/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
$('#container-notifications').bind('mousemove touchmove touchstart', function (e) {
  var chart,
    point,
    i,
    event;

  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
    chart = Highcharts.charts[i];
    event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
    point = chart.series[0].searchPoint(event, true); // Get the hovered point

    if (point) {
      point.highlight(e);
    }
  }
});
/**
 * Override the reset function, we don't need to hide the tooltips and crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
  this.onMouseOver(); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
        }
      }
    });
  }
}
