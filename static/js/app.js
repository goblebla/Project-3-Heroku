//Read the data
// d3.csv("https://raw.githubusercontent.com/bloy86/Test_D3/master/COVID_Unemployment-All%20Formatted%20General.csv", function(data) {


// set the dimensions and margins of the graph
var margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = 210 - margin.left - margin.right,
  height = 210 - margin.top - margin.bottom;

// List of groups (here I have one group per column)
var allGroup = ["cumulative_cases", 
"cumulative_cases_per_100_000", 
"cumulative_deaths", 
"cumulative_deaths_per_100_000", 
"new_cases_7_day_rolling_avg",
"new_cases_per_100_000",
"new_deaths_7_day_rolling_avg",
"new_deaths_per_100_000",
"InitialClaims", 
"ContinuedClaims", 
"InsuredUnemploymentRate"]

// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

function update(selectedGroup) {
  console.log(selectedGroup)

  const url = "/api/unemployment";
  d3.json(url).then(function (data) {
    // console.log(data);

    var parseTime = d3.timeParse("%m/%e/%y");

    //   var COVIDdata. = "12,345,678";
    // str = data.new_cases_7_day_rolling_avg.replace(/,/g, "");
    // parseInt(data.new_cases_7_day_rolling_avg.replace(/,/g, ""), 10);

    data.forEach(function (data) {
      data.Date = parseTime(data.Date);

      // data.InitialClaims = +data.InitialClaims;
      // console.log(typeof data.new_cases_7_day_rolling_avg);

      // data.new_cases_7_day_rolling_avg = +data.new_cases_7_day_rolling_avg;
      // data.ContinuedClaims = +data.ContinuedClaims;
      // data.new_cases_7_day_rolling_avg = parseInt(data.new_cases_7_day_rolling_avg.replace(/,/g, ""), 10);
      data.ContinuedClaims = parseInt(data.ContinuedClaims.replace(/,/g, ""), 10);
      data.InitialClaims = parseInt(data.InitialClaims.replace(/,/g, ""), 10)
    });

    console.log(data);

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) { return d.State; })
      .entries(data);

    // What is the list of groups?
    allKeys = sumstat.map(function (d) { return d.key })

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    /*
    conda create -n covid python=3.6
    source activate covid | conda activate covid
    python app.py
    pip install LIBRARY
    pip install gunicorn
    pip freeze >requirements.txt
    toutch Procfile
    echo "web: gunicorn covid/app:app" >Procfile

    */

   d3.select("#my_dataviz").html("");
    var svg = d3.select("#my_dataviz")
    .selectAll("uniqueChart")
      .data(sumstat)
      .enter()
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // A function that update the chart
    //function update(selectedGroup) {

    // Create new data with the selection?
    //var dataFilter = data.map(function(d){return {time: d.Date, value:d[selectedGroup]} })
// https://www.d3indepth.com/scales/
    // Add X axis --> it is a date format
    // var x = d3.scaleLinear()
    //   .domain(d3.extent(data, function (d) { return d.Date; }))
    //   .range([0, width]);
      var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.Date; }))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisBottom")
      .call(d3.axisBottom(x).ticks(3));


    //Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d[selectedGroup]; })])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // color palette
    var color = d3.scaleOrdinal()
      .domain(allKeys)
      .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#e41a1c', '#a65628', '#f781bf', '#999999'])

    // Draw the line
    svg
      .append("path")
      .attr("fill", function (d) { return color(d.key) })
      .attr("stroke", "none")
      .attr("d", function (d) {
        return d3.area()
          .x(function (d) { return x(d.Date) })
          .y0(y(0))
          .y1(function (d) { return y(+d[selectedGroup]) })
          (d.values)
      })

    // Add titles
    svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", -5)
      .attr("x", 0)
      .text(function (d) { return (d.key) })
      .style("fill", function (d) { return color(d.key) })

    //}

    // When the button is changed, run the updateChart function
    // d3.select("#selectButton").on("change", function (d) {
    //   // recover the option that has been chosen
    //   var selectedOption = d3.select(this).property("value")
    //   // run the updateChart function with this selected option
    //   update(selectedOption)
    // })

  })

}

update("cumulative_cases")
