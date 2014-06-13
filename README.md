# FuseViz API

### Initialize

var fuseVizInstance = new fuseViz(args);

  => args
  (string) chartType: 'bar', 'pie'
  (string) DOM Element: where to chart (css selector)
  (object) data: json data from Fuse

  Example:
  var fuseVizInstance = FuseViz('bar', '#chart', data);

-----------------------------------------------------------

### Change chart type

fuseVizInstance
  .chartType(args);

  => args
  (string) chartType: 'bar', 'pie'

  Example:
  fuseVizInstance.chartType('pie');

-----------------------------------------------------------

### Update chart (new data)

fuseVizInstance
  .update(args);

  => args
  (object) data: json data from Fuse

  Example:
  fuseVizInstance.update(data);

-----------------------------------------------------------

### Clear graph (clear data from graph, not removing)

fuseVizInstance
  .clear()

-----------------------------------------------------------

### Remove graph

  fuseVizInstance
    .remove()