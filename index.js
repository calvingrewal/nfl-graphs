var svg = d3.select("svg"),
  margin = {top: 20, right: 80, bottom: 30, left: 50},
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleLinear().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
  .curve(d3.curveBasis)
  .x(function(d) { return x(d.Yds); })
  .y(function(d) { return y(d.points); });

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;

  var games = data.columns.map(function(id) {
    return {
      id,
      values: data.map(function(d, i) {
        return {
          passYds: d.Yds,
          points: d.Result
        }
      })
    }
  });

  console.log(games)

  x.domain(d3.extent(data, function(d) { return d.passYds; }));

  y.domain([
    d3.min(games, function(g) { return d3.min(g.values, function(d) { return d.points; }); }),
    d3.max(games, function(g) { return d3.max(g.values, function(d) { return d.points; }); })
  ]);

  z.domain(games.map(function(g) { return g.id; }));

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Points");

  var game = g.selectAll(".game")
    .data(games)
    .enter().append("g")
    .attr("class", "game");

  game.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return z(d.id); });

  game.append("text")
    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.passYds) + "," + y(d.value.points) + ")"; })
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif")
    .text(function(d) { return d.id; });
});

function type(d, _, columns) {
  d.date = parseTime(d.date);
  d.Result = d.Result.split('-')[0].split(' ')[1]
  for (var i = 1, n = columns.length, c; i < n; ++i) {
    d[c = columns[i]] = d[c];
  }
  return d;
}