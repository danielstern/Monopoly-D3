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

  var svg = d3.select("#probabilities").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("monopoly.json", function (error, res) {

    //debugger;
    //var data = res.properties.filter(reg);
    var data = res.properties;
    x.domain(data.map(function (d) {
      d.averageProbability = d.averageProbability / 100;
      return d.name;
    }));
    y.domain([0, d3.max(data, function (d) {
      return d.averageProbability;
    })]);
    //debugger;

    //svg.append("g")
    //  .attr("class", "x axis")
    //  .attr("transform", "translate(0," + height + ")")
    //  .call(xAxis);



    var bar = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr('fill', function (d) {
        if (d.group === 'Utilities') return 'lightgray';
        if (d.group === 'Railroad') return 'darkgray';
        if (d.group === 'Special') return 'brown';
        return d.group
      })
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.averageProbability);
      })
      .attr("height", function (d) {
        return height - y(d.averageProbability);
      });
    //
    var tips = svg.selectAll("g")
      .data(data)
      .enter()
      .append("text:g")
      .attr('transform',function(d){
        return'translate('+(x(d.name) + 15) +','+(height - 5)+')'
      })
      .attr('class','tip')

    tips
      .append('g:text')
      .attr('fill', function (d) {
        if (d.group === 'Purple' || d.group === 'darkblue' || d.group === 'Special') {
          return '#ddd'
        }
        return '#111';
      })
      .text(function(d){return d.name})
      //.text(function(d){return d.name + " - " + d3.format('')(d.averageProbability,3)})
      .attr('transform','rotate(-90)')

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("averageProbability");
    //
    //bar
    //  .append('text')
    //  .text('hi')

  });

  function type(d) {
    d.averageProbability = +d.averageProbability;
    return d;
  }
})();
