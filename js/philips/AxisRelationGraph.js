PHILIPS.AxisRelationGraph = function AxisRelationGraph(_g1, _g2, _x, _y, _width, _height) {
  
  console.log("Constructor AxisRelationGraph");

  var g1=_g1;
  var g2=_g2;
  var width=_width;
  var height=_height;
  var posX=offsetX=_x;
  var posY=offsetY=_y;
  var r=30;
  var offsetLeft=r;
  
  var xScale=d3.scale.linear().range([offsetLeft, width]);
  var xScaleRelations;

  init = function(){


  }

  function update(scope, _dataIndexes, _fill, _exit, viewStates){

    if(_exit) {
      updateRelationLines([]);
      updateAxis(true);
      return;
    }

    console.log(_dataIndexes)
    var scaleLinear=d3.scale.linear().domain([0,1]);

    var extentRelation;
    var topoData=topojson.feature(scope.data.topo, scope.data.topo.objects.states).features;

    _.each(_dataIndexes, function(d){

        var d3Properties=scope.entrys[d].d3Properties;
        //console.log(d3Properties)
        var sMin=scaleLinear(d3Properties.extent[0]);
        if(!extentRelation){
          extentRelation=[];
          extentRelation[0]=sMin;
        }else if(sMin<extentRelation[0]){
          extentRelation[0]=sMin;
        }

        var sMax=scaleLinear(d3Properties.extent[1]);
        if(!extentRelation[1]){
          extentRelation[1]=sMax;
        }else if(sMax>extentRelation[1]){
          extentRelation[1]=sMax;
        }
    })


    xScaleRelations=d3.scale.linear().range([offsetLeft, width-100]).domain([extentRelation[0], extentRelation[1]]);

    _.each(_dataIndexes, function(d, i){
       var d3Properties=scope.entrys[d].d3Properties;
       _.each(topoData, function(k){
          k.properties.bubble["cx"+d]=xScaleRelations(d3Properties.rateBy.stateId.get(k.id));
          if(!k.properties.bubble["cx"+d])k.properties.bubble["cx"+d]=-1000;
       })
      
      updateAxisBubbleGraph(scope, topoData, d, i, d3Properties, _exit, viewStates[i])

    })

    updateRelationLines(topoData, 500);
    updateAxis();
    
  }

  function updateAxisBubbleGraph(scope, topoData, entry, viewIndex, d3Properties, _exit, viewState){

    console.log("viewState :", viewState)

    var bubbleStates=svgStack["viewIndex_"+viewIndex].selectAll("#bubbles-"+viewIndex).data(topoData, function(d){
        return d.id;
      });


    bubbleStates.enter().append("circle")
      .attr("class", "bubbles")
      .attr("id", "bubbles-"+viewIndex)
      .attr("cx", function(d){
        return d.properties.bubble["cx"+viewIndex];
      })
      .attr("cy", function(d){
        return d.properties.bubble["cy"+viewIndex];
      })
      .attr("r", 0)
      .style("fill", function(d){
        var cValue=d3Properties.scales.quantile( d3Properties.rateBy.stateId.get(d.id) );
        return colorbrewer[d3Properties.utils.cbScheme]['9'][ cValue]

      })
      .style("stroke", "#333")
      .style("stroke-width", 0.25)
      .style("opacity", 0)


      bubbleStates.on("mouseover", function(d){
          d3Views.d3Legenda.mouseOverHandler(true, d.id);
          d3Views.d3Legenda.setValue(svgStack["viewIndex_"+viewIndex], d3Properties, d.properties.code, d3Properties.rateBy.stateId.get(d.id), viewState, viewIndex);

          d.properties.relation=true;
          updateRelationLines(topoData, 100);
      }) 
      .on("mouseout", function(d){
          d3Views.d3Legenda.mouseOverHandler(false, d.id);
          d3Views.d3Legenda.setValue(svgStack["viewIndex_"+viewIndex], d3Properties, "avg.", null, viewState, viewIndex);
          d.properties.relation=false;
          updateRelationLines(topoData, 1000);
      })
      .on("click", function(d) {
          //console.log("state :"+d.properties.name+" value :"+d3Properties.rateBy.stateId.get(d.id) )
      })


      bubbleStates.transition().duration(500)
        .attr("class", "bubbles")
        .attr("id", "bubbles-"+viewIndex)
        .attr("cx", function(d){
          return d.properties.bubble["cx"+viewIndex];
        })
        .attr("cy", function(d){
          
          var cy = getYpos(viewIndex);
          d.properties.bubble["cy"+viewIndex]=cy;
          return d.properties.bubble["cy"+viewIndex];
          
        })
        .attr("r", function(d){
          var r=4;
          d.properties.bubble["r"+viewIndex]=r;
          return r;
        })
        .style("stroke", "#333")
        .style("stroke-width", 0.25)
        .style("fill", function(d){
          var cValue=d3Properties.scales.quantile( d3Properties.rateBy.stateId.get(d.id) );
          return colorbrewer[d3Properties.utils.cbScheme]['9'][ cValue]

        })
        .style("opacity", 1)
        .style("fill-opacity", 0.75)

  }

  function updateRelationLines(topoData, twTime){
    
    var relations=svgStack.gAxis.selectAll("#relation-paths").data(topoData, function(d){
      return d.id;
    });



    relations.enter().append("g")
      .attr("id", "relation-paths")
      .attr("class", "relation-path")
      .each(function(d){
        var g=d3.select(this);
        g.append("line")
          .attr("id", "relation-path")
          .attr("x1",  0)
          .attr("x2",  0)
          .attr("y1", height/2)
          .attr("y2", height/2)
        
        g.append("text")
          .attr("id", "relation-label")
          .attr("class", "axis-labels")
          .style("fill", "#333")
          .style("text-anchor", "middle")
          .attr("y", function(d){
            return d.properties.bubble["cy1"]+16;
          })
          .attr("x", function(d){
            return d.properties.bubble["cx1"];
          })
          .text(d.properties.code)
          .style("opacity", 0)

        g.append("text")
          .attr("id", "relation-label")
          .attr("class", "axis-labels")
          .style("fill", "#333")
          .style("text-anchor", "middle")
          .attr("y", function(d){
            return d.properties.bubble["cy0"]-8;
          })
          .attr("x", function(d){
            return d.properties.bubble["cx0"];
          })
          .text(d.properties.code)
          .style("opacity", 0)

          
      })



    relations.each(function(d){

      var g=d3.select(this);
      var line=g.select("#relation-path")

      line.transition().duration(twTime)
        .attr("x1", function(d){
          return d.properties.bubble["cx0"];
        })
        .attr("x2", function(d){
          return d.properties.bubble["cx1"];
        })
        .attr("y1", function(d){
          return d.properties.bubble["cy0"];
        })
        .attr("y2", function(d){
          return d.properties.bubble["cy1"];
        })
        .style("stroke-width", function(d){
          if(d.properties.relation){
            return 1
          }else{
            return 0.25
          }
        })


        g.selectAll("#relation-label").transition().duration(twTime)
          .style("opacity", function(){
            if(d.properties.relation){
              return 1;
            }else{
              return 0;
            }
          })

    })


      relations.exit().transition()
        .style("opacity", 0)
        .remove()  

  }

  function updateAxis(_exit){
    var data=[]
    for(var i=0; i<100; i++){
      if(i%5==0){
        data.push(i);
      }

    }

    if(_exit)data=[];

    var yAxis=svgStack.gAxis.selectAll("#axis-ticks").data(data, function(d){
      return d;
    });

    yAxis.enter().append("g")
      .attr("id", "axis-ticks")
      .attr("transform", function(d){
        var x=xScaleRelations(d);
        return "translate(" + x + "," + (height/2) + ")"
      })
      .style("opacity", 0)
      .each(function(d){
        var gT=d3.select(this);

          var xAxis=gT.selectAll("#x-axis").data([0,1]); 

          xAxis.enter().append("line")
            .attr("id", "x-axis")
            .attr("class", "x-axis-line-dashed")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", function(k){
              return -200+(k*400)
            })
            .attr("y2", function(k){
              return -200+(k*400)
            })


          gT.append("line")
            .attr("class", "axis-line-dashed")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", -220)
            .attr("y2", 220)

          gT.append("text")
            .attr("class", "axis-labels")
            .attr("y", -225)
            .style("text-anchor", "middle")
            .text(d+"%")

          gT.append("text")
            .attr("class", "axis-labels")
            .attr("y", 235)
            .style("text-anchor", "middle")
            .text(d+"%")  


      })


      yAxis.transition().duration(500).style("opacity", 1)
        // .each(function(d){
        //   d3.select(this).select(".axis-line-dashed")
        //     .attr("y1", -220)
        //     .attr("y2", 220)
        // })

      yAxis.exit().remove();



  }


  function getYpos(viewIndex){
    if(viewIndex==0){
      return height/2 - 200;
    }else{
      return height/2 + 200;
    }


  }

  this.init=init;
  this.update=update;

  
}