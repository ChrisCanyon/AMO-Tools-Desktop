'use strict';

import { Component, OnInit} from '@angular/core';

declare var d3: any;

var svg;

var width = 1650,
    height = 1200;

const baseWidth = 1650;

@Component({
  selector: 'app-sankey',
  templateUrl: 'sankey.component.html',
  styleUrls: ['sankey.component.css']
})

export class SankeyComponent implements OnInit{

  private color: string = "#127bdc";
  constructor() {
  }

  ngOnInit() {
  }

  closeSankey(){
    //Remove Sankey
    d3.select('body').selectAll('svg').remove();

  }

  maxSankey(){
    svg.attr("transform", "scale(2)");
  }
  minSankey(){
    svg.attr("transform", " scale(.8)");
  }

  makeSankey(){

    //Remove  all Sankeys
    d3.select('app-sankey-diagram').selectAll('svg').remove();

    var nodes = [

      /*0*/{ name: "Input", value: 300, proportionX: (150/baseWidth), x: 0 ,y:0, input: true, usefulOutput: false, inter: false, top: false},
      /*1*/{ name: "inter1", value: 0, proportionX: (450/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: true},
      /*2*/{ name: "Flue_Gas_Losses", value: 70, proportionX: (620/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: true},
      /*3*/{ name: "inter2", value: 0, proportionX: (500/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: false},
      /*4*/{ name: "Atmosphere_Losses", value: 40, proportionX: (650/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: false},
      /*5*/{ name: "inter3", value: 0, proportionX: (630/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: true},
      /*6*/{ name: "Other_Losses", value: 20, proportionX: (770/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: true},
      /*7*/{ name: "inter4", value: 0, proportionX: (740/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: false},
      /*8*/{ name: "Water_Cooling_Losses", value: 30, proportionX: (890/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: false},
      /*9*/{ name: "inter5", value: 0, proportionX: (900/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: true},
      /*10*/{ name: "Wall_Losses", value: 40,  proportionX: (1030/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: true},
      /*11*/{ name: "inter6", value: 0, proportionX: (1070/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: false},
      /*12*/{ name: "Opening_Losses", value: 10, proportionX: (1200/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: true},
      /*13*/{ name: "inter7", value: 0, proportionX: (1130/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: true, top: false},
      /*14*/{ name: "Fixture_Losses", value: 10,  proportionX: (1270/baseWidth), x: 0, y: 0, input: false, usefulOutput: false, inter: false, top: false},
      /*15*/{ name: "Useful_Output", value: 0,  proportionX: (1350/baseWidth), x: 0, y: 0, input: false, usefulOutput: true, inter: false, top: true}
    ];
    var links = [
      //linking to the first interNode
      { source: 0, target: 1},
      //interNode1 to Flue Gas and interNode2
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      //interNode2 to Atmosphere and interNode3
      { source: 3, target: 4 },
      { source: 3, target: 5 },
      //interNode3 to Other and interNode4
      { source: 5, target: 6 },
      { source: 5, target: 7 },
      //interNode4 to Water and interNode5
      { source: 7, target: 8 },
      { source: 7, target: 9 },
      //interNode5 to Wall and interNode6
      { source: 9, target: 10 },
      { source: 9, target: 11 },
      //interNode6 to Opening and interNode7
      { source: 11, target: 12 },
      { source: 11, target: 13 },
      //interNode7 to Fixture and Useful Output
      { source: 13, target: 14 },
      { source: 13, target: 15 }
    ];


    svg = d3.select('app-sankey-diagram').append('svg')
          .call(calcSankey)
          .attr("viewBox", "0 0 " + width + " " + height)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .style("border", "1px solid black")
          .append("g");

    var tShiftVal;

    function calcSankey() {
      var alterVal = 0, shiftVal;

      nodes.forEach(function (d, i) {
        d.y = (height/2 - nodes[0].value/2);
        if (d.inter) {
          //Reset height
          if (i == 1) {
            //First interNode
            d.value = nodes[i - 1].value;
            d.x = (width*d.proportionX);
            shiftVal = (nodes[0].x + nodes[0].value) - d.x;
            width += shiftVal;
            tShiftVal = shiftVal;
          }
          else {
            //Previous node.val - interNode.value
            d.value = (nodes[i - 2].value - nodes[i - 1].value);
            if (d.top) {
              d.y = d.y + alterVal;
            }
            else {
              alterVal += (nodes[i - 2].value - d.value);
              d.y = (d.y + alterVal);
            }
          }
          d.x = (width*d.proportionX) + shiftVal;
        }
        else {
          if(!d.input) {
            if (d.usefulOutput) {
              d.y = d.y + alterVal;
              d.value = (nodes[i - 2].value - nodes[i - 1].value);
            }
            else {
              if (d.top) {
                d.y -= nodes[i - 1].value - alterVal;
              }
              else {
                d.y += (nodes[i - 1].value * 2) + alterVal;
              }
            }
            d.x = (width*d.proportionX) + shiftVal;
          }
          else{
            d.x = (width*d.proportionX);
          }
        }
      });
      console.log("Shift: " + tShiftVal);
      updateDisplay(tShiftVal);
    }

    function updateDisplay(addition){
      console.log(d3.select('app-sankey-diagram').selectAll('svg'));
      console.log("ratio: " + (baseWidth/width));
      d3.select('app-sankey-diagram').selectAll('svg')
        .attr("viewBox", "0 0 " + width+400 + " " + height);
    }

    function makeLinks(d){

      var points = [];

      if(nodes[d.source].input){
        points.push([nodes[d.source].x, (nodes[d.target].y+( nodes[d.target].value/2))]);
        points.push([nodes[d.target].x, (nodes[d.target].y+(nodes[d.target].value/2))]);
      }
      //If it links up with an inter or usefulOutput then go strait tot the interNode
      else if(nodes[d.target].inter || nodes[d.target].usefulOutput){
        points.push([(nodes[d.source].x - 5), (nodes[d.target].y+( nodes[d.target].value/2))]);
        points.push([nodes[d.target].x, (nodes[d.target].y+(nodes[d.target].value/2))]);
      }
      else {
        //Curved linkes
        if(nodes[d.target].top) {
          points.push([(nodes[d.source].x-5 ), (nodes[d.source].y+(nodes[d.target].value/2))]);
          points.push([(nodes[d.source].x + 30), (nodes[d.source].y+(nodes[d.target].value/2))]);
          points.push([(nodes[d.target].x ),(nodes[d.target].y + (nodes[d.target].value / 2))]);
        }
        else {
          points.push([(nodes[d.source].x-5), ((nodes[d.source].y+nodes[d.source].value)-(nodes[d.target].value/2))]);
          points.push([(nodes[d.source].x + 30), (((nodes[d.source].y+nodes[d.source].value)-(nodes[d.target].value/2)))]);
          points.push([(nodes[d.target].x ),(nodes[d.target].y - (nodes[d.target].value / 2))]);
        }
      }

      return linkGen(points);
    };

    function getEndMarker(d){
      if(!nodes[d.target].inter || nodes[d.target].usefulOutput) {
        return "url(" + window.location + "#end-" + nodes[d.target].name + ")";
      }
      else{
        return "";
      }
    }

    var color = d3.scaleLinear()
      .domain([0, nodes[0].value])
      .range(["#ffcc00", "#ff3300"]);


    links.forEach( function(d, i) {
      var link_data = d;
      svg.append("linearGradient")
        .attr("id", function(){
          return "linear-gradient-" + i;
        })
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", nodes[link_data.source].x)
        .attr("y1", function() {
          if (nodes[link_data.target].inter || nodes[link_data.target].usefulOutput){
            return (nodes[link_data.target].y + (nodes[link_data.target].value/2));
          }
          else{
            if(nodes[link_data.target].top) {
              return nodes[link_data.source].y;
            }
            else{
              return (nodes[link_data.source].y+nodes[link_data.source].value);
            }
          }
        })
        .attr("x2", nodes[link_data.target].x)
        .attr("y2", function(){
          if (nodes[link_data.target].inter || nodes[link_data.target].usefulOutput) {
            return (nodes[link_data.target].y + (nodes[link_data.target].value/2));
          }
          else{
            return nodes[link_data.target].y;
          }
        })
        .selectAll("stop")
        .data([
          {offset: "0%", color: color(nodes[link_data.source].value)},
          {offset: "76%", color: color(nodes[link_data.target].value)},
        ])
        .enter().append("stop")
        .attr("offset", function (d) {
          return d.offset;
        })
        .attr("stop-color", function (d) {
          return d.color;
        });
    });


    svg.selectAll('marker')
      .data(links)
      .enter().append('svg:marker')
      .attr('id', function (d) {
        return 'end-' + nodes[d.target].name;
      })
      .attr('orient', 'auto')
      .attr('refX', .1)
      .attr('refY', 0)
      .attr("viewBox", "0 -5 10 10")
      .attr("fill", function (d) {
        return color(nodes[d.target].value);
      })
      .append('svg:path')
      .attr("d", "M0,-2.5L2,0L0,2.5");

    function updateColors(){

      nodes.forEach(function(d){
        var node_data = d;
        if(!d.inter || d.usefulOutput) {
          svg.select("#end-" + d.name)
            .attr("fill", function () {
              return color(node_data.value);
            })
        }
      });

      links.forEach( function(d, i) {
        var link_data = d;
        svg.select("#linear-gradient-" + i)
          .attr("x1", nodes[link_data.source].x)
          .attr("y1", function() {
            if (nodes[link_data.target].inter || nodes[link_data.target].usefulOutput){
              return (nodes[link_data.target].y + (nodes[link_data.target].value/2));
            }
            else{
              if(nodes[link_data.target].top) {
                return nodes[link_data.source].y;
              }
              else{
                return (nodes[link_data.source].y+nodes[link_data.source].value);
              }
            }
          })
          .attr("x2", nodes[link_data.target].x)
          .attr("y2", function(){
            if (nodes[link_data.target].inter || nodes[link_data.target].usefulOutput) {
              return (nodes[link_data.target].y + (nodes[link_data.target].value/2));
            }
            else{
              return nodes[link_data.target].y;
            }
          })
          .selectAll("stop")
          .data([
            {offset: "0%", color: color(nodes[link_data.source].value)},
            {offset: "76%", color: color(nodes[link_data.target].value)},
          ])
          .attr("offset", function (d) {
            return d.offset;
          })
          .attr("stop-color", function (d) {
            return d.color;
          });
      });

    }

    var linkGen = d3.line()
      .curve(d3.curveMonotoneX);

    //Draw links to the svg
    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(links)
      .enter().append('path')
      .attr("d", function(d){
        return makeLinks(d);
      })
      .style("stroke", function(d, i){
        return "url(" + window.location + "#linear-gradient-" + i + ")"
      })
      .style("fill", "none")
      .style("stroke-width", function(d){
        return nodes[d.target].value;
      })
      .attr('marker-end', function(d){
        return getEndMarker(d);
      });

    //Draw nodes to the svg
    var node = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .append("polygon")
      .attr('class', 'node');


    var nodes_text = svg.selectAll(".nodetext")
      .data(nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dx", function(d){
        if(d.input){
          return d.x - 70;
        }
        else if(d.usefulOutput){
          return d.x + (nodes[15].value*.8) + 50;
        }
        else {
          return d.x;
        }
      })
      .attr("dy", function(d){
        if(d.input || d.usefulOutput){
          return d.y + (d.value/2);
        }
        else {
          if (d.top) {
            return d.y - 100;
          }
          else {
            return d.y + 100;
          }
        }
      })
      .text(function(d) {
        if(!d.inter) {
          return d.name;
        }
      });

    nodes.forEach(function(d, i){
      var node_val  = d, i = i;
      if(!node_val.inter) {
        svg.append('foreignObject')
          .attr("id", "inputObject")
          .attr("x", function () {
            if (node_val.input) {
              return node_val.x - 120;
            }
            else if (node_val.usefulOutput) {
              return d.x + (nodes[15].value*.8);
            }
            else {
              return node_val.x - 50;
            }
          })
          .attr("y", function () {
            if (node_val.input || node_val.usefulOutput) {
              return (node_val.y + (node_val.value / 2)) + 10;
            }
            else if (node_val.top) {
              return node_val.y - 80;
            }
            else {
              return node_val.y + 50;
            }
          })
          .attr("width", 100)
          .attr("height", 50)
          .append("xhtml:sankey-diagram")
          .append("input")
          .data(nodes)
          .attr("type", "text")
          .attr("id", node_val.name)
          .attr("value", function(){
            var format = d3.format(",");
            return format(node_val.value);
          })
          .style("width", "100px")
          .on("change", function(){
            if(isNaN(parseFloat(this.value))){
              nodes[i].value = 0;
            }
            else{
              nodes[i].value = parseFloat(this.value.replace(new RegExp(",", "g"), ""));
            }
            calcSankey();
            updateColors();
            link
              .attr("d", function(d){
                return makeLinks(d)
              })
              .style("stroke-width", function(d){
                //returns a links width equal to the target's value
                return nodes[d.target].value;
              })
              .attr("marker-end", function (d) {
                return getEndMarker(d);
              });
            link
              .style("stroke", function(d, i){
                return "url(" + window.location + "#linear-gradient-" + i + ")"
              });
            nodes_text
              .attr("dx", function(d){
                if(d.input){
                  return d.x - 70;
                }
                else if(d.usefulOutput){
                  return d.x + (nodes[15].value*.8) + 50;
                }
                else {
                  return d.x;
                }
              })
              .attr("dy", function(d){
                if(d.input || d.usefulOutput){
                  return d.y + (d.value/2);
                }
                else {
                  if (d.top) {
                    return d.y - 100;
                  }
                  else {
                    return d.y + 100;
                  }
                }
              });

            changePlaceHolders();
          });
      }
    });


    function changePlaceHolders(){
      svg.selectAll("input")
        .attr("value", function(d,i){
          var format = d3.format(",");
          if(i == 8){
            return format(nodes[15].value);
          }
          else {
            return format(nodes[i * 2].value);
          }
        });
      svg.selectAll("foreignObject")
        .data(nodes)
        .attr("x", function (d, i) {
          if(i == 8){
            return nodes[15].x + (nodes[15].value*.8);
          }
          else if(nodes[i * 2].input){
            return nodes[i * 2].x - 120;
          }
          else{
            return nodes[i * 2].x - 50;
          }
        })
        .attr("y", function (d, i) {
          if (nodes[i].input){
            return (nodes[i * 2].y + (nodes[i * 2].value / 2)) + 10;
          }
          else if(i == 8 ){
            return (nodes[15].y + (nodes[15].value / 2)) + 10;
          }
          else{
            if (nodes[i * 2].top) {
              return nodes[i * 2].y - 80;
            }
            else {
              return nodes[i * 2].y + 50;
            }
          }
        });

    }
  }
}
