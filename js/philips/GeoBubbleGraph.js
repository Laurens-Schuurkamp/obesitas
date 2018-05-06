PHILIPS.GeoBubbleGraph = function GeoBubbleGraph(_g, _x, _y, _width, _height) {
  
  console.log("Constructor BubbleMap");

  var g=_g;
  var width=_width;
  var height=_height;
  var posX=offsetX=_x;
  var posY=offsetY=_y;

  var r=30;

  init = function(){


  }

  function update(scope, dataIndex, viewIndex, _fill, _exit, offset, viewState){

    offsetX=offset.x;
    offsetY=offset.y;

    var d3Properties=scope.entrys[dataIndex].d3Properties;    
    updateBubbleGraph(scope.data, scope.entrys[dataIndex].entry, viewIndex, viewState, d3Properties, _exit);
  }

  function updateBubbleGraph(data, entry, viewIndex, viewState, d3Properties, _exit){

    var topoData=topojson.feature(data.topo, data.topo.objects.states).features;
    if(_exit) topoData=[];

    var bubbleStates=svgStack["viewIndex_"+viewIndex].selectAll("#bubbles-"+viewIndex).data(topoData, function(d){
      if(!d.properties.centroid) d.properties.centroid=d3Views.d3GeoTopoMap_0.getCentroid(d);
      if(!d.properties.bubble) d.properties.bubble={};
      return d.id;
    }); 

    bubbleStates.enter().append("circle")
      .attr("class", "bubbles")
      .attr("id", "bubbles-"+viewIndex)
      .attr("cx", function(d){
        var cx=d.properties.centroid[0];
        if(!cx) cx=0;
        d.properties.bubble["cx"+viewIndex]=offsetX+cx;
        return d.properties.bubble["cx"+viewIndex];
      })
      .attr("cy", function(d){
        var cy = d.properties.centroid[1];
        if(!cy) cy = 0;
        d.properties.bubble["cy"+viewIndex]=offsetY+cy;
        return d.properties.bubble["cy"+viewIndex];
      })
      .attr("r", 0)
      .style("fill", function(d){
        var cValue=d3Properties.scales.quantile( d3Properties.rateBy.stateId.get(d.id) );
        return colorbrewer[d3Properties.utils.cbScheme]['9'][ cValue]

      })
      .style("opacity", 0)

      bubbleStates.on("mouseover", function(d){
          d3Views.d3Legenda.mouseOverHandler(true, d.id);
          d3Views.d3Legenda.setValue(g, d3Properties, d.properties.code, d3Properties.rateBy.stateId.get(d.id), viewState, viewIndex);
      }) 
      .on("mouseout", function(d){
          d3Views.d3Legenda.mouseOverHandler(false, d.id);
          d3Views.d3Legenda.setValue(g, d3Properties, "avg.", null, viewState, viewIndex);
      })
      .on("click", function(d) {
          //console.log("state :"+d.properties.name+" value :"+d3Properties.rateBy.stateId.get(d.id) )
      })


      bubbleStates.transition().duration(d3Properties.utils.twTime)
        .attr("cx", function(d){
          var cx=d.properties.centroid[0];
          if(!cx) cx=0;
          d.properties.bubble["cx"+viewIndex]=offsetX+cx;
          return d.properties.bubble["cx"+viewIndex];
        })
        .attr("cy", function(d){
          var cy = d.properties.centroid[1];
          if(!cy) cy =0;
          d.properties.bubble["cy"+viewIndex]=offsetY+cy;
          return d.properties.bubble["cy"+viewIndex];
        })          
        .attr("r", function(d){

          var s=d3Properties.scales.normalized(d3Properties.rateBy.stateId.get(d.id));
          if(!s || s<=0 ) {
            return 0.1;
          }
          d.properties.bubble["r"+viewIndex]=5+(s*r);
          return d.properties.bubble["r"+viewIndex];
        })
        .style("fill", function(d){
          var cValue=d3Properties.scales.quantile(d3Properties.rateBy.stateId.get(d.id));
          return d3Logic.getColorCode(cValue, d3Properties.utils.cbScheme);

        })
        .style("opacity", 0.75)

      
      bubbleStates.exit().transition().duration(d3Properties.utils.twTime)       
        .attr("r", 0)
        .style("opacity", 0)
        .remove();

  }



  this.init=init;
  this.update=update;

  
}