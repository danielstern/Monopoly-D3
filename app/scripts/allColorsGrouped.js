function reg(a){
  return a.group !== 'Utilities' &&
    a.group !== 'Special' &&
    a.group !== 'Railroad';
}
(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10,'$');

  var svg = d3.select("#whole").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //d3.csv("data.csv", function(error, data) {
  d3.json("monopoly.json", function(error, res) {
    var properties = res.properties.reduce(function(a,b){
      //debugger;
      var same = a.filter(function(data){
        //console.log(data.group, b.group);
        return data.group === b.group;
      })[0];
      if (same) {
        same.price+= b.price;
        same.housecost+= b.housecost;
      } else {
        a.push({
          'price': b.price,
          'housecost': b.housecost,
          'group': b.group
        })
      }

      return a;
    },[]);

    //debugger;

    var data = properties.filter(reg).map(function(property){
      return {
        "Own":property.price,
        "One house":property.price + property.housecost,
        "Two houses":property.price + property.housecost * 2,
        "Three houses":property.price + property.housecost * 3,
        "Four houses":property.price + property.housecost * 4,
        "Hotel":property.price + property.housecost * 5,
        group:property.group,
      }
    })
  //  debugger;

    console.log(data);
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "group"; });

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name],group: d.group}; });
    });

    x0.domain(data.map(function(d) { return d.group; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    //svg.append("g")
    //  .attr("class", "x axis")
    //  .attr("transform", "translate(0," + height + ")")
    //  .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Cost to Purchase and Build Up");

    var group = svg.selectAll(".group")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.group) + ",0)"; });

    group.selectAll("rect")
      .data(function(d) { return d.ages; })
      .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d,i) { return d3.hsl(d.group).brighter(i/10); });

    var legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .append('text')
      .text('Left to Right: 1 House, 2 Houses, 3 Houses, 4 Houses, A Hotel')
      .attr("x", width - 24)
      .attr("y", 9)
      .style("text-anchor", "end")
      .attr("dy", ".35em")

    //legend.append("rect")
    //  .attr("x", width - 18)
    //  .attr("width", 18)
    //  .attr("height", 18)
    //  .style("fill", color);

    //legend.append("text")
    //  .attr("x", width - 24)
    //  .attr("y", 9)
    //  .attr("dy", ".35em")
    //
    //  .text(function(d,i) { return i + " " + d; });

  });
})();
