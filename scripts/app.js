(function() {
  'use strict';

  var tokens = {};
  var $userQuery = $('#userQuery');
  var facetSelect = document.getElementById('facetSelect');
  var query;
  var promise = {};
  var chart;
  var parsedFacets;

  var prepareNVD3Data = function(facet, allValues) {
    return [{
      values: allValues,
      key: facet,
      color: '#2ca02c'
    }];
  };

  var parseAllFacets = function(data) {
    var freq;
    var parsedFacets = _.map(data.items, function(item) {
      freq = 0;
      _.forEach(item.items, function(it) {
        freq += it.freq;
      });
      return {
        value: freq,
        label: item.label
      };
    });

    return parsedFacets;
  };

  var parseOneFacet = function(data) {
    var parsedFacet = _.map(data.items, function(item) {
      return {
        value: item.freq,
        label: item.value
      };
    });

    return parsedFacet.length > 0 ? parsedFacet : [{value: 0}];
  };

  promise.getAllFacets = webServices.getAllFacets();
  promise.getAllFacets.success(function(data) {
    PubSub.publish('facets.getAll', data);
  });

  $(facetSelect).on('change', function(e) {
    e.preventDefault();
    query = facetSelect.options[facetSelect.selectedIndex].text.toLowerCase().replace(' ', '_');
    $userQuery.text(facetSelect.options[facetSelect.selectedIndex].text);
    if(query !== 'all_facets') {
      promise.getFacet = webServices.getFacet(query);
      promise.getFacet.success(function(data) {
        PubSub.publish('facets.getOne', data);
      });
    }
    else {
      d3.select('#chart svg')
        .datum(prepareNVD3Data('All facets', parsedFacets))
        .transition()
        .duration(500)
        .call(chart);
    }
  });

  var graphAllFacets = function(msg, data) {
    parsedFacets = parseAllFacets(data);

    // Populate the select with the facets
    var i = 1;
    _.forEach(parsedFacets, function(facet) {
      facetSelect.options.add( new Option(facet.label, i++));
    });

    nv.addGraph(function() {
      chart = nv.models.discreteBarChart()
        .x(function(d) {
          return d.label;
        })
        .y(function(d) {
          return d.value;
        })
        .staggerLabels(true)
        .tooltips(true)
        // .showValues(true)
        .transitionDuration(350);

      chart.xAxis
        .axisLabel(facetSelect.options[facetSelect.selectedIndex].text);

      chart.yAxis
        .axisLabel('Frequency')
        .tickFormat(d3.format('g'));

      d3.select('#chart svg')
        .datum(prepareNVD3Data('All facets', parsedFacets))
        .transition()
        .duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  };
  var graphOneFacet = function(msg, data) {
    var parsedFacet = parseOneFacet(data);

    chart.xAxis
      .axisLabel(facetSelect.options[facetSelect.selectedIndex].text);

    d3.select('#chart svg')
      .datum(prepareNVD3Data(facetSelect.options[facetSelect.selectedIndex].text, parsedFacet))
      .transition()
      .duration(500)
      .call(chart);
  };

  tokens.allFacets = PubSub.subscribe( 'facets.getAll', graphAllFacets );
  tokens.facet = PubSub.subscribe( 'facets.getOne', graphOneFacet );

})();
