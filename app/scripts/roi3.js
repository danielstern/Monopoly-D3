(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

  var svg = d3.select("#roi3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("monopoly.json", function(error, res) {

    var data = res.properties.filter(function(d){
      if (d.group === 'Special') {
        return false;
      }
      if (d.group === 'Railroad' || d.group === 'Utilities') {
        return false;
      }
      d.roi =  d.multpliedrent[4] / (d.price + d.housecost) * (( d.averageProbability / 2.5));
      return true;
    });

    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.roi; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("ROI");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr('fill',function(d){
        if (d.group === 'Utilities') return 'lightgray';
        if (d.group === 'Railroad') return 'darkgray';
        return d.group})
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.roi); })
      .attr("height", function(d) { return height - y(d.roi); });
  });

  function type(d) {
    d.roi = +d.roi;
    return d;
  }
})();
