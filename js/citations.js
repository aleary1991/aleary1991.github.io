var width = $(window).width();
var height = $(window).height()-50;

console.log(width);
console.log(height);

var rscale = d3.scale.linear();

rscale.domain([0,5]).range([10,height/10]);

function showCitations(data){

  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .charge(-350)
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

  function tick() {
    circle.attr("transform", transform);;
    text.attr("transform", transform);
  }

  function transform(d){
    return "translate(" + d.x + "," + d.y + ")";
  }
}