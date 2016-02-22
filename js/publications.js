var margin = {top: 0, bottom: 0, left: 10, right: 10};
var width = parseInt(d3.select('#canvas').style('width'), 10);
width = width - margin.left - margin.right;

var height = 400;

var sortByAuthorX = false;
var sortByYearX = false;
var sortByCitationsX = false;

var maxCitations = 0;
var minCitations = 0;
var maxYear = 0;
var minYear = 3000;

var globalData;

function showAllX(){
    sortByAuthorX = false;
    sortByYearX = false;
    sortByCitationsX = false;
    d3.select("#labels").remove();
  }

function viewByAuthorX(){
    sortByAuthorX = true;
    sortByYearX = false;
    sortByCitationsX = false;
    d3.select("#labels").remove();
  }

function viewByYearX(){
    sortByYearX = true;
    sortByAuthorX = false;
    sortByCitationsX = false;
    d3.select("#labels").remove();
  }

function viewByCitationsX(){
  sortByYearX = false;
  sortByAuthorX = false;
  sortByCitationsX = true;
  d3.select("#labels").remove();
}

function addButton(div,value,buttonfunction){
  div.append("input")
    .attr("type","button")
    .attr("class","button")
    .attr("value",value)
    .attr("onclick",buttonfunction);
}

console.log(width);
console.log(height);

function showCitations(data){

  var rscale = d3.scale.linear();
  rscale.domain([0,5]).range([0,width/10]);

  var chargescale = d3.scale.linear();
  chargescale.domain([0,1000]).range([+50,-200]);

  var fontscale = d3.scale.linear();
  fontscale.domain([0,1000]).range([10,15]);

  globalData = data;

  for (var i=0; i<data.length; i++){
    if (data[i].CitedBy > maxCitations){
      maxCitations = data[i].CitedBy;
    }
  }

  for (var i=0; i<data.length; i++){
    if (data[i].Year > maxYear){
      maxYear = data[i].Year;
    }
    if (data[i].Year < minYear){
      minYear = data[i].Year;
    }
  }

  d3.select("#xbuttons").selectAll("*").remove();
  d3.select("#canvas").selectAll("*").remove();

  var xbuttons = d3.select("#xbuttons").append("g");

  addButton(xbuttons,"Don't Sort","showAllX()");
  addButton(xbuttons,"Sort by Author","viewByAuthorX()");
  addButton(xbuttons,"Sort by Year","viewByYearX()");
  addButton(xbuttons,"Sort by Citations","viewByCitationsX()");

  console.log("Force: "+chargescale(width))

  force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .charge(chargescale(width))
    .on("tick", tick)
    .start();

  var svg = d3.select("#canvas").append("svg")
    .attr("id","svg")
    .attr("class","svg")
    .attr("width", width)
    .attr("height", height);

  d3.select("#svg").append("line")
    .attr("id", "bottomborder")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height)
    .attr("y2", height)
    .attr("stroke-width",1)
    .attr("stroke","black");

  d3.select("#svg").append("line")
    .attr("id", "topborder")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke-width",1)
    .attr("stroke","black");

  d3.select("#svg").append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke-width",1)
    .attr("stroke","black");

  d3.select("#svg").append("line")
    .attr("id","rightborder")
    .attr("x1", width)
    .attr("x2", width)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke-width",1)
    .attr("stroke","black");


  var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("font-size",fontscale(width)+"px")
    .text(function(d) { return d.Label; });

  var circle = svg.selectAll("a")
    .data(force.nodes())
    .enter()
    .append("a")
    .attr("target","_blank")
    .attr("xlink:href", function(d){ return d.URL;})
    .append("circle")
    .attr("class","circles")
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
    var k = width/40*e.alpha;
    var kh = height/80*e.alpha;
    data.forEach(function(o,i) {
      if (sortByAuthorX == true){
        if (o.Author == true){
          o.x += -k;
        } else {
          o.x += k;
        }
      } else if (sortByYearX == true){
        o.x += (parseInt(o.Year)-(minYear+maxYear)/2)*k*2/(maxYear-minYear);
      } else if (sortByCitationsX == true){
        o.x += (o.CitedBy - maxCitations/2)*k*2/maxCitations;
      }
    });

    circle.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    text.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
  }
}

d3.select(window).on('resize', resize); 

function resize() {

  width = parseInt(d3.select('#canvas').style('width'), 10);
  width = width - margin.left - margin.right;

  console.log(width);

  showCitations(globalData);

  /*d3.select("#svg")
  .attr("width", width)
  .attr("height", height);

  d3.select("#bottomborder")
  .attr("x2", width);

  d3.select("#topborder")
  .attr("x2", width);

  d3.select("#rightborder")
  .attr("x1", width)
  .attr("x2", width);

  force.size([width, height]).start();*/
}