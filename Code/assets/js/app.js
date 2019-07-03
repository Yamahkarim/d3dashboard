// Income vs Smokers
//Part1: Animated Scatter Plot
//Use d3 to graph the outline of the box tht will hold the plot
var width = parseInt(d3.select("#scatter").style("width")); 
var height = width - width / 4.2; 
// add spacing
var margin = 20; 
var labels = 110; 
var txtSpcBot = 40; 
var txtSpcLeft = 40; 
// draw canvas for scatterplot 
var svg= d3 
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class","chart"); 
//create a function to easily call for the radius of scatter plot points  
var pointRadius; 
function crGet() {
    if (width <= 530) {
        pointRadius = 4; 
    }
    else {
        pointRadius= 9;
    }
}
crGet();   
// Axis Labels: 
//----- Bottom Axis ----- 
// create group element to nest label for bottom axis 
svg.append("g").attr("class", "xText"); 
//select element 
var xText = d3.select(".xText");  
function xTextRefresh() {
    xText.attr(
        "transform", 
        "translate(" + 
            ((width - labels) / 2 + labels) + 
            ", " + 
            (height - margin - txtSpcBot) + 
            ")"
    );
}
xTextRefresh();
//apend Xtext to the axis for income 
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");
//----- Left Axis ----- 
// use variable to enchance transformed readability 
var leftTextX = margin + txtSpcLeft; 
var leftTextY = (height+ labels) / 2 -labels;  
// add label group for Y axis 
svg.append("g").attr("class","yText"); 
//select Y axis text as a group 
var yText = d3.select(".yText"); 
// add functionality to window  transform 
function yTextRefresh () { 
    yText.attr(
        "transform", 
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
} 
yTextRefresh(); 
//append y-axis text for smokers 
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");
/// Import CSV and visualize data
// d3.csv("assets/data/data.csv").then(function(data) {
//     visualize(data);
// }); 
d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
  });
//Create visualization function 
function visualize(theData) {
    var curX="income";
    var curY="smokes";
    //set min/max values
    var xMin;
    var xMax;
    var yMin;
    var yMax;
    /// Tool Tips
    var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40,-60])
    .html(function(d) {
        // x key
        var theX; 
        // state name
        var theState = "<div>" + curY + ": " + d[curX] + "%</div>";
        // grab the y value key and value
        var theY = "<div>" + curY + ": " +d[curY] + "%</div>";
        // if X key is income
        if (curX === "income") {
            theX= "<div>" + curX +": " + d[curX] + "%</div>"; 
        }
        else {
            theX = "<div>" + curX + ": " +
            parseFloat(d[curX]).toLocaleString("en") + "</div>";
        }
        //display 
        return theState + theX + theY; 
    });
    // Call tooltip function
    svg.call(toolTip);
  // PART 2: D.R.Y!
  // ==============
  // These functions remove some repitition from later code.
  // This will be more obvious in parts 3 and 4.
  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }
  
  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  };
//Instantiate the Graph 
  xMinMax();
  yMinMax();
  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labels, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labels, margin]);
  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);
  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();
  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labels) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labels) + ", 0)");
  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();
  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", pointRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });
  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + pointRadius / 2.5;
    })
    .attr("font-size", pointRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    })}; 

//   //   // Part 4: Trendline
  	
// 		// get the x and y values for least squares
//   var xSeries = d3.range(1, xLabels.length + 1);
//   var ySeries = data.map(function(d) { return parseFloat(d['rate']); });
  
//   var leastSquaresCoeff = leastSquares(xSeries, ySeries);
  
//   // apply the reults of the least squares regression
//   var x1 = xLabels[0];
//   var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
//   var x2 = xLabels[xLabels.length - 1];
//   var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
//   var trendData = [[x1,y1,x2,y2]];
//   var trendline = svg.selectAll(".trendline")
//   .data(trendData);
  
// trendline.enter()
//   .append("line")
//   .attr("class", "trendline")
//   .attr("x1", function(d) { return xScale(d[0]); })
//   .attr("y1", function(d) { return yScale(d[1]); })
//   .attr("x2", function(d) { return xScale(d[2]); })
//   .attr("y2", function(d) { return yScale(d[3]); })
//   .attr("stroke", "black")
//   .attr("stroke-width", 1);

    //// END MY CODE 

    // Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var self = d3.select(this);

    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make curY the same as the data name.
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });
