PHILIPS.GeoTopoMap = function GeoTopoMap(_g, _x, _y, _width, _height) {
  
  console.log("Constructor Geo map");
  var g=_g;
  var posX=offsetX=_x;
  var posY=offsetY=_y;
  var width=_width;
  var height=_height;
 
  var projection = d3.geo.albersUsa()
      .scale(960)
      .translate([ width / 2, height / 2.25 ]);

  var geoPath = d3.geo.path()
      .projection(projection);

  var gGeoMap = g.append("g")
    .attr("transform", "translate(" + offsetX + "," + 0 + ")" )

  init = function(){

  }

  function update(scope, dataIndex, viewIndex, _fill, _exit, viewState){
    
    var d3Properties=scope.entrys[dataIndex].d3Properties;
    updateGeoMapStates(scope.data, scope.entrys[dataIndex].entry, viewIndex, d3Properties, _fill, _exit, viewState)
    updateGeoMapCounties(scope.data.topo, _exit);

    
    d3Views.d3Legenda.updateLegenda(g, d3Properties, viewState, viewIndex);
    d3Views.d3Legenda.setValue(g, d3Properties, "avg.", null, viewState, viewIndex);

    console.log(viewState)

  }

  function updateGeoMapStates(data, entry, viewIndex, d3Properties, _fill, _exit, viewState) {
    
    var topoData=topojson.feature(data.topo, data.topo.objects.states).features;
    if(_exit) topoData=[];

    console.log(data)

    var geoStates=gGeoMap.selectAll("#states-"+viewIndex).data(topoData, function(d){
      return d.id;
    });

    geoStates.enter().append("path")
      .attr("class", "states")
      .attr("id", "states-"+viewIndex)
      .attr("d", geoPath)
      .style("fill", "#fff")
      .style("opacity", 0)

    geoStates.on("mouseover", function(d){
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
      
    geoStates.transition().duration(d3Properties.utils.twTime)
      .style("opacity", 1)
      .style("fill", function(d){
          return d3Logic.getColorCode(6, d3Properties.utils.cbScheme);
        
      })
      .style("fill-opacity", function(d){
        if(!_fill) return 0;

        var cValue=0;
        if(viewState.scale=="linear"){
          return d3Properties.scales.linear(d3Properties.rateBy.stateId.get(d.id));
        }else{
          return d3Properties.scales.normalized(d3Properties.rateBy.stateId.get(d.id));
        }

      })

    if(viewState.scale=="quantile"){
      geoStates.transition().duration(d3Properties.utils.twTime)
      .style("fill", function(d){
        var cValue=0;
          cValue=d3Properties.scales.quantile(d3Properties.rateBy.stateId.get(d.id));
          return d3Logic.getColorCode(cValue, d3Properties.utils.cbScheme);
      })
      .style("fill-opacity", function(d){
        if(!_fill) return 0;
        return 1;

      })


    } 

    geoStates.exit().transition().duration(d3Properties.utils.twTime)
      .style("opacity", 0)
      .remove()

  }

  function updateGeoMapCounties(data){

    // gGeoMap.append("path")
    //     .datum(topojson.mesh(data.topo, data.topo.objects.counties, function(a, b) { 
    //       return a !== b; 
    //     }))
    //     .attr("class", "counties")
    //     .attr("d", function(d){
    //       return geoPath(d);
    //     })

    return;
  
    var topoData=[]
    if(geoShape=="topo") data=topojson.feature(data, data.objects.counties).features;

    var geoCounties=gGeoMap.selectAll(".counties").data(topoData, function(d){
      return d.id;
    });

    geoCounties.enter().append("path")
      .attr("class", "counties")
      .attr("d", geoPath)

    geoCounties.exit().transition().duration(d3Properties.utils.twTime)
      .remove()


  }
  getCentroid = function(d){
      return geoPath.centroid(d);
  }

  // public functions
  this.init = init;
  this.update = update;
  this.getCentroid=getCentroid;
  
}