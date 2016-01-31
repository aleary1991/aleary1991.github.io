var width = $(window).width();
var height = $(window).height()-50;

var sortByAuthor = false;
var sortByYear = false;

function showAll(){
    sortByAuthor = false;
    sortByYear = false;
  }

function viewByAuthor(){
    sortByAuthor = true;
    sortByYear = false;
  }

function viewByYear(){
    sortByYear = true;
    sortByAuthor = false;
  }

console.log(width);
console.log(height);

var rscale = d3.scale.linear();

rscale.domain([0,5]).range([0,100]);

function showCitations(data){

  var buttons = d3.select("body").append("g");

  buttons.append("input")
    .attr("type","button")
    .attr("class","button")
    .attr("value","View All")
    .attr("onclick","showAll()");

  buttons.append("input")
    .attr("type","button")
    .attr("class","button")
    .attr("value","View My Work")
    .attr("onclick","viewByAuthor()");

    buttons.append("input")
    .attr("type","button")
    .attr("class","button")
    .attr("value","View By Year")
    .attr("onclick","viewByYear()");

  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .charge(-200)
    .on("tick", tick)
    .start();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(function(d) { return d.Label; });

  var circle = svg.selectAll("a")
    .data(force.nodes())
    .enter()
    .append("a")
    .attr("xlink:href", function(d){ return d.URL;})
    .append("circle")
    .attr("r", function(d,i) { return rscale(Math.sqrt(d.CitedBy/Math.PI)); })
    .style("fill", function(d, i) {
      if (d.Label == "Thesis"){
        return 'rgba(0, 255, 0, 0.3)';
      }
      else if (d.Author == false){
        return 'rgba(0, 0, 255, 0.3)'; 
      }
      else { return 'rgba(255, 0, 0, 0.3)'}
    })
    .style("stroke", function(d, i) { return 'black'; })
    .call(force.drag);

  d3.select("body")
    .on("mousedown", mousedown);

  function mousedown() {
    data.forEach(function(o, i) {
      o.x += (Math.random() - .5) * 10;
      o.y += (Math.random() - .5) * 10;
    });
    force.resume();
  }

  function tick(e) {
    var k = 10*e.alpha;
    data.forEach(function(o,i) {
      if (sortByAuthor == true && o.Author == true){
        o.x += 2*k;
      } else if (sortByYear == true){
        o.x += (2013-parseInt(o.Year))*-1*k;
      }
    });

    circle.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    text.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
  }
}