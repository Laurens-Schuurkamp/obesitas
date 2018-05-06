PHILIPS.AxisBubbleGraph = function AxisBubbleGraph(_g, _x, _y, _width, _height) {
  
  console.log("Constructor AxisBubbleMap");

  var g=_g;
  var width=_width;
  var height=_height;
  var posX=offsetX=_x;
  var posY=offsetY=_y;
  var r=30;
  var offsetLeft=r;

  var xScaleAxis = d3.scale.ordinal().rangeRoundBands([offsetLeft, width], 0);
  var xAxis = d3.svg.axis().scale(xScaleAxis).orient("bottom")
  var gXaxis = svgStack.gAxis.append("g").attr({class: "x-axis", transform: "translate(0," + height/2 + ")"})

  init = function(){


  }

  function update(scope, dataIndex, viewIndex, _fill, _exit, viewState, sortOrder){

    console.log("exit ")

    var d3Properties=scope.entrys[dataIndex].d3Properties;
    var topoData=topojson.feature(scope.data.topo, scope.data.topo.objects.states).features;
    
    topoData=d3Logic.sortDataSet(scope, sortOrder, "up");
    if(_exit) topoData=[]; 

    xScaleAxis.domain(topoData.map(function(d) { return d.properties.name; }));  
    updateAxisBubbleGraph(scope, topoData, scope.entrys[dataIndex].entry, viewIndex, d3Properties, _exit);



    if(viewIndex==0){
      updateAxis(scope, topoData, _exit)
    }

  }

  function updateAxisBubbleGraph(scope, topoData, entry, viewIndex, d3Properties, _exit){

    var bubbleStates=g.selectAll("#bubbles-"+viewIndex).data(topoData, function(d){
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
      .style("opacity", 0)

      bubbleStates.on("click", function(d){
          stateViewHandler.updateSorting(scope, entry);
      })

      bubbleStates.transition().duration(500)
        .attr("class", "bubbles")
        .attr("id", "bubbles-"+viewIndex)
        .attr("cx", function(d){
          var cx=xScaleAxis(d.properties.name);
          d.properties.bubble["cx"+viewIndex]=cx;
          return d.properties.bubble["cx"+viewIndex];
        })
        .attr("cy", function(d){
          var cy = getYpos(viewIndex);
          d.properties.bubble["cy"+viewIndex]=cy;
          return d.properties.bubble["cy"+viewIndex];
          
        })
        .attr("r", function(d){
          var s=d3Properties.scales.normalized(d3Properties.rateBy.stateId.get(d.id));
          if(!s || s<=0 ) {
            return 0.1;
          }
          d.properties.bubble.r=s*r;
          return d.properties.bubble.r;
        })
        .style("fill", function(d){
          var cValue=d3Properties.scales.quantile( d3Properties.rateBy.stateId.get(d.id) );
          return colorbrewer[d3Properties.utils.cbScheme]['9'][ cValue]

        })
        .style("opacity", 1)
        .style("fill-opacity", 0.75)

  }

  function updateAxis(scope, topoData, _exit){

    console.log("update xaxis")

    if(_exit)topoData=[];


    var bubbleAxis=svgStack.gAxis.selectAll("#axis-bubbles-labels").data(topoData, function(d){
      return d.id;
    }); 

    bubbleAxis.enter().append("g")
      .attr("id", "axis-bubbles-labels")
      .attr("transform", function(d){
        var x=xScaleAxis(d.properties.name);
        return "translate(" + x + "," + (height/2) + ")"
      })
      .style("opacity", 0)
      .each(function(d){
        var gLabel=d3.select(this);

        gLabel.append("text")
          .attr("class", "label-legenda")
          .attr("y", 4)
          .style("font-size", 12)
          .style("text-anchor", "middle")
          .text(d.properties.code)

        gLabel.append("line")
          .attr("class", "label-line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", 8)
          .attr("y2", 1.5*r)

        gLabel.append("circle")
          .attr("class", "label-circle")
          .attr("cx", 0)
          .attr("cy", 1.5*r)
          .attr("r", 1)  

        gLabel.append("line")
          .attr("class", "label-line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", -8)
          .attr("y2", -1.5*r)  

        gLabel.append("circle")
          .attr("class", "label-circle")
          .attr("cx", 0)
          .attr("cy", -1.5*r)
          .attr("r", 1)   

      })
      .on("click", function(){
          stateViewHandler.updateSorting(scope, "states")
      })

    bubbleAxis.transition().duration(500)
      .style("opacity", 1)
      .attr("transform", function(d){
        var x=xScaleAxis(d.properties.name);
        return "translate(" + x + "," + (height/2) + ")"
      })

    bubbleAxis.exit().remove(); 


  }

  function getYpos(viewIndex){
    if(viewIndex==0){
      return height/2 - (1.5*r);
    }else{
      return height/2 + (1.5*r);
    }


  }

  this.init=init;
  this.update=update;

  
}