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
  var margin = {top: 30, right:80, bottom: 70, left:50},
      width = 300 - margin.left - margin.right,
      height = 175 - margin.top - margin.bottom;

  // set the format for parsing the date / time
  var dateFormat = d3.timeFormat("%b %d %y");
  var bisectDate = d3.bisector(function(d) { return d.time; }).left
  var formatValue = d3.format(",.2f");
  var formatCurrency = function(d) { return "$" + formatValue(d); };

  //Initialise colors for the different plots
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      scope.$watch('data', function (newVal, oldVal) {
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

          // set the ranges
          var x = d3.scaleTime().range([0, width]);
          var y = d3.scaleLinear().range([height, 0]);

          // define the line creating function
          var priceline = d3.line()
              .x(function(d) { return x(d.time);  })
              .y(function(d) { return y(d.close); })

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

          svg.append("g")
             .attr("class", "y axis")
             .call(d3.axisLeft(y))
             .append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".71em")
             .style("fill", '#000')
             .text("Price ($)");

          var focus = svg.append("g")
                      .attr("class", "focus")
                      .style("display", "none");

          focus.append("circle")
                .attr("r", 4.5);

          focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");

          svg.append("rect")
             .attr("class", "overlay")
             .attr("id", cryptoData.crypto)
             .attr("width", width)
             .attr("height", height)
             .on("mouseover", function() { focus.style("display", null); })
             .on("mouseout", function() { focus.style("display", "none"); })
             .on("mousemove", mousemove);

          function mousemove() {

            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(cryptoData.prices, x0, 1),
               d0 = cryptoData.prices[i - 1],
               d1 = cryptoData.prices[i],
                d = x0 - d0.time > d1.time - x0 ? d1 : d0;

            focus.attr("transform", "translate(" + x(d.time) + "," + y(d.close) + ")");
            focus.select("text").text(formatCurrency(d.close));
          }
        })
      })
    }
  }
});
