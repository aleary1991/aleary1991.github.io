var windowwidth = $(window).width();
var windowheight = $(window).height();
var width = 800;
var height = 400;
if (height > windowheight){
  height = windowheight*2/3;
}
if (width > windowwidth){
  width = windowwidth*2/3;
}

var sortByAuthorX = false;
var sortByYearX = false;
var sortByCitationsX = false;
var sortByAuthorY = false;
var sortByYearY = false;
var sortByCitationsY = false;
var authorLabels = ["First Author:", "Contributing Author:"];
var yearLabels = ["2011:","2012:","2013:","2014:","2015:","2016:"];

var maxCitations = 0;
var minCitations = 0;
var maxYear = 0;
var minYear = 3000;

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

function showAllY(){
    sortByAuthorY = false;
    sortByYearY = false;
    sortByCitationsY = false;
    d3.select("#labels").remove();
  }

function viewByAuthorY(){
    sortByAuthorY = true;
    sortByYearY = false;
    sortByCitationsY = false;
    d3.select("#labels").remove();
  }

function viewByYearY(){
    sortByYearY = true;
    sortByAuthorY = false;
    sortByCitationsY = false;
    d3.select("#labels").remove();
  }

function viewByCitationsY(){
  sortByYearY = false;
  sortByAuthorY = false;
  sortByCitationsY = true;
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

var rscale = d3.scale.linear();

rscale.domain([0,5]).range([0,80]);

function showCitations(data){

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

  var xbuttons = d3.select("#xbuttons").append("g").attr("class","buttons");
  var ybuttons = d3.select("#ybuttons").append("g").attr("class","buttons");

  addButton(xbuttons,"Don't Sort","showAllX()");
  addButton(xbuttons,"Sort by Author","viewByAuthorX()");
  addButton(xbuttons,"Sort by Year","viewByYearX()");
  addButton(xbuttons,"Sort by Citations","viewByCitationsX()");

  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .charge(-150)
    .on("tick", tick)
    .start();

  var svg = d3.select("#citations").append("svg")
    .attr("id","svg")
    .attr("class","svg")
    .attr("width", width)
    .attr("height", height);

  d3.select("#svg").append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height)
    .attr("y2", height)
    .attr("stroke-width",1)
    .attr("stroke","black");

  d3.select("#svg").append("line")
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
    .text(function(d) { return d.Label; });

  var circle = svg.selectAll("a")
    .data(force.nodes())
    .enter()
    .append("a")
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
      if (sortByAuthorY == true){
        if (o.Author == true){
          o.y += kh;
        } else {
          o.y += -kh;
        }
      } else if (sortByYearY == true){
        o.y -= (parseInt(o.Year)-(minYear+maxYear)/2)*kh*2/(maxYear-minYear);
      } else if (sortByCitationsY == true){
        o.y -= (o.CitedBy - maxCitations/2)*kh*2/maxCitations;
      }
    });

    circle.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    text.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
  }
}