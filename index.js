function drawGraph(id, dataType, xAxisLabel) {
  var svg = d3.select(id),
    margin = {
      top: 10,
      right: 80,
      bottom: 30,
      left: 50
    },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y%m%d");
  var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3.line()
    .x(function(d) {
      return x(d.data);
    })
    .y(function(d) {
      return y(d.points);
    })
    .curve(d3.curveLinear)

  d3.csv("data.csv", type, function(error, data) {
    if (error) throw error;
    const games = getGamesFromData(data)

    x.domain(d3.extent(games, function(d) {
      return d.data;
    }));

    y.domain(d3.extent(games, function(d) {
      return d.points
    }));

    z.domain(games.map(function(g, i) {
      return i;
    }));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append('text')
      .text(xAxisLabel)
      .attr('fill', '#000')
      .attr('dy', '25px')
      .attr('x', "150px")

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Points");

    const color = `hsl(${Math.floor(Math.random()*360)}, 100%, 40%)`
    g.append('g')
      .attr('class', 'circle-container')
      .selectAll('.dot')
      .data(games)
      .enter()
      .append('circle')
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr('cx', function(d) { return x(d.data) })
      .attr('cy', function(d) { return y(d.points) })
      .style("fill", function(d) { return color });

  });

  function type(d, _, columns) {
    d.date = parseTime(d.date);
    d.Result = d.Result.split('-')[0].split(' ')[1]
    for (var i = 1, n = columns.length, c; i < n; ++i) {
      d[c = columns[i]] = isNaN(parseFloat(d[c])) ? 0 : parseFloat(d[c]);
    }
    return d;
  }

  function getGamesFromData(data) {

    var games = data.map(function(game, i) {

      return {
        data: game[dataType],
        points: game.Result,

      }
    }).sort(function(a, b) {
      return a.data - b.data
    });

    games.pop()
    return games
  }
}

drawGraph('#graph1', 'Yds', 'Passing Yards')
drawGraph('#graph2', 'Rate', 'Passer Rating')
drawGraph('#graph3', 'Int', 'Interceptions')
drawGraph('#graph4', 'Cmp%', 'Completion %')
drawGraph('#graph5', 'TD', 'Touchdowns')
drawGraph('#graph6', 'Y/A', 'Yards Per Attempt')