var webServices = (function() {
  'use strict';

  var getAllFacets = function() {
    return $.get(urlService.getFacets);
  };

  var getFacet = function(query) {
    return $.get(urlService.getFacets + '/' + query);
  };

  return {
    getAllFacets: getAllFacets,
    getFacet: getFacet
  };

})();
