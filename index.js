function drawGraph(id, dataType) {
  var svg = d3.select(id),
    margin = {
      top: 20,
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
      .text(dataType)
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

    // g.append('g').append("path")
    //   .datum(games)
    //   .attr("class", "line")
    //   .attr("d", function(d) {
    //     const linepath = line(d)
    //
    //     return linepath;
    //   })
    //   .style("stroke", function(d) {
    //     return `hsl(${Math.floor(Math.random()*360)}, 100%, 40%)`;
    //   });
    window.g = g
    const color = `hsl(${Math.floor(Math.random()*360)}, 100%, 40%)`
    g.selectAll('.dot')
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
      d[c = columns[i]] = isNaN(parseInt(d[c])) ? 0 : parseInt(d[c]);
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

drawGraph('#graph1', 'Yds')
drawGraph('#graph2', 'Rate')
drawGraph('#graph3', 'Int')
drawGraph('#graph4', 'Cmp%')
drawGraph('#graph5', 'TD')