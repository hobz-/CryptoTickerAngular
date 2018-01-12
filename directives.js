trackerApp.directive('cryptoCard', function() {
  return {
    restrict: 'EA',
    templateUrl: '/CryptoTickerAngular/directives/cryptocard.html',
    replace: true,
    scope: {
      crypto: '=',
      marketData: '=',
      index: '=',
      getDailyChange: "&",
      formatNum: "&",
      currencySymbol: '='
    }
  }
})

trackerApp.directive('lineCharts', function() {
  // set the dimensions and margins of the graph
  var margin = {top: 30, right:20, bottom: 70, left:50},
      width = 350 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  //Initialise colors for the different plots
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // define the line creating function
  var priceline = d3.line()
      .x(function(d) { return x(d.time);  })
      .y(function(d) { return y(d.close); })

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      scope.$watch('data', function (newVal, oldVal) {
        console.log(element);
        if (!newVal) {
          return;
        }

        newVal.forEach((cryptoData, id) => {
          let div = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

          let svg = d3.select(element[0])
                    .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .attr("class", "d-inline-block")
                    .append("g")
                      .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

          // Scale the range of the data
          x.domain(d3.extent(
            cryptoData.prices.map(
              (point) => {
                return point.time;
            })
          ));


          y.domain([0, d3.max(
            cryptoData.prices.map(
              (point) => {
                return point.close;
            })
          )]);

          svg.append("path")
             .attr("class", "line")
             .style("stroke", color(id))
             .attr("d", priceline(cryptoData.prices));

         svg.selectAll("dot")
            .data(cryptoData.prices)
              .enter().append("circle")
            .attr("r", 0.5)
            .attr("cx", function(d) { return x(d.time); })
            .attr("cy", function(d) { return y(d.close); })
            .on("mouseover", function(d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(formatTime(d.time) + "<br/>" + d.close)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
              })
            .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              });

          svg.append("text")
             .attr("x", width/2)
             .attr("y", 0)
             .attr("class", "title") //add css styling
             .style("fill", color(id))
             .text(cryptoData.crypto);

          // Add the X Axis
          svg.append("g")
             .attr("class", "axis")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %y")));

          // Add the Y Axis
          svg.append("g")
             .attr("class", "axis")
             .call(d3.axisLeft(y));
         })
      })
    }
  }
});
