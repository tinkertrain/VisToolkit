/* global atomic, nv, d3, _ */
(function() {
  'use strict';

  var parsedData = function(facet, allValues) {
    return [{
      values: allValues,
      key: facet,
      color: '#2ca02c'
    }];
  };

  atomic.get('/data/facets.type.json')
    .success(function(data) {
      var facet = data.items.label;
      var items = data.items[0].items;
      var allValues = [];

      _.forEach(items, function(item) {
        allValues.push({
          label: item.value,
          value: item.freq
        });
      });
      console.log(nv);
      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label;
          })
          .y(function(d) {
            return d.value;
          })
          .tooltips(false)
          .showValues(true)
          .transitionDuration(350);

        chart.xAxis
          .axisLabel('Type');

        chart.yAxis
          .axisLabel('Frequency')
          .tickFormat(d3.format('g'));

        d3.select('#chart svg')
          .datum(parsedData(facet, allValues))
          .transition().duration(500)
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    })
    .error(function(data) {
      console.log(data);
    });
})();
