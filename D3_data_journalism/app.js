// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.obesity = +data.healthcare;
      data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare) * 3.0, d3.max(healthData, d => d.healthcare) * -0.275])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.income) * 0.9, d3.max(healthData, d => d.income) * 1.1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles and Add Text
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .attr("stroke", "black");

    var textGroup = chartGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.income))
    .attr("dy", ".50em")
    .classed("stateCircle", true)
    .text(d => d.abbr)

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background","#000080")
    .style("color","#E0FFFF")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state} <br>Healthcare: ${d.healthcare}% <br>Income: $${d.income} `);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    
    chartGroup.append("text")
      .style("font-size", "16px")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.4))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("stroke","#black")
      .text("Median Household Income ($)");

    chartGroup.append("text")
      .style("font-size", "16px")
      .attr("transform", `translate(${width / 2.25}, ${height + margin.top + 32})`)
      .attr("class", "axisText")
      .attr("stroke", "black")
      .text("Healthcare (%)");
}).catch(function(error) {
    console.log(error);

});