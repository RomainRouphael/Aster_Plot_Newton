var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("body").append("svg")
    //.attr("width", width)
    .attr("width", 1.3 * width)  
    //.attr("height", height)
    .attr("height", 1.3 * height)
    .append("g")
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    .attr("transform", "translate(" + width / 2 + "," + (1.1 * height) / 2 + ")");


svg.call(tip);

d3.csv('asterplotnewtonglobal.csv', function(error, data) {

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.score;
    d.width  = +d.weight;
    d.label  =  d.label;
  });
   
//   for (var i = 0; i < 10; i++) { console.log(data[i].legendcolor) }
  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  


  // calculate the weighted mean score
  var score = 
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score * b.weight); 
    }, 0) / 
    data.reduce(function(a, b) { 
      return a + b.weight; 
    }, 0);

  svg.append("svg:text")
    .attr("class", "aster-score")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text(Math.round(score));

});


d3.csv('legend.csv', function(error, datalegend) {

  datalegend.forEach(function(d) {
    d.legendtitle = d.legendtitle;
    d.legendcolor = d.legendcolor;
  });

var legend = svg.selectAll(".legend")
                .data(datalegend)
                .enter().append("g")              
                .attr("transform", function(d, i) { return "translate(0," + i * 20 +  ")"; });

legend.append("rect")
      .attr("x", width - 120)
      .attr("y", - width / 2)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return d.legendcolor; });

  legend.append("text")
      .attr("x", width - 130)
      .attr("y", - width / 2 + 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.legendtitle; });


  });

