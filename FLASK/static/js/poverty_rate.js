// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data 
d3.json('https://raw.githubusercontent.com/DavidMoon-184/Roosters_Project_2/main/FLASK/datasets/poverty_line.json', function(error,data) {
    // List of groups (here I have one group per column)
    console.log(error)
    console.log(data)
    var allGroup = d3.map(data, function(d){return(d.geo)}).keys()

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.time; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(7));
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Years");
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("extreme poverty (percentage)");
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.poverty_percent; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.geo==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.time) })
          .y(function(d) { return y(+d.poverty_percent) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .attr("clip-path", "url(#clip)")
        .style("stroke-width", 4)
        .style("fill", "none");



    
    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.geo==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.time) })
            .y(function(d) { return y(+d.poverty_percent) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})