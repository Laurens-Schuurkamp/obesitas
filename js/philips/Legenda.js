PHILIPS.Legenda = function Legenda(_g, _x, _y, _width, _height) {
  
  console.log("Constructor Legenda");

  var g=_g;
  var width=_width;
  var height=_height;
  var posX=offstetX=_x;
  var posY=offstetY=_y;
  var scope;

  var scaleW=240;
  var scaleH=16;

  init = function(){

  }

  function update(scope, viewIndex, _fill, _exit){  
    updateDotsGraph(scope, "states", _exit);
  };

  function updateDotsGraph(scope, sortEntry, _exit){

    var topoData=topojson.feature(scope.data.topo,scope.data.topo.objects.states).features;
    
    topoData=d3Logic.sortDataSet(scope, sortEntry, "up");

    if(_exit) topoData=[];

    var gLegenda=g.selectAll("#legenda-states").data(topoData, function(d){
      return d.id;
    });

    gLegenda.enter().append("g")
      .attr("id", "legenda-states")
      .attr("class", "legenda")
      .each(function(d,i){
        var gThis=d3.select(this);
        var dots=gThis.selectAll("#dots").data(scope.entrys);
        dots.enter().append("circle")
          .attr("id", "dots")
          .attr("cx", function(k,j){
            return 10 + (j*16)
          })
          .attr("cy", -6)
          .style("fill", function(k,j){
            var cValue=k.d3Properties.scales.quantile( k.d3Properties.rateBy.stateId.get(d.id) );
            return d3Logic.getColorCode(cValue, k.d3Properties.utils.cbScheme);
            
          })
          .attr("r", function(k,j){
            var s=k.d3Properties.scales.normalized(k.d3Properties.rateBy.stateId.get(d.id));
            if(!s || s<=0 ) {
              return 0.01;
            }
            return s*6;
          })
          .on("click", function(k){
              //console.log(k.entry)
              updateDotsGraph(scope, k.entry, _exit);
          })

        gThis.append("text")
          .attr("class", "label-legenda")
          .attr("id", "label_"+d.id)
          .attr("x", 72)
          .text(d.properties.name)
          .on("click", function(k){
              updateLegenda(scope, "states", _exit);
          })

      })

      gLegenda.transition().duration(500).attr("transform", function(d, i){
          return "translate(" + 0 + "," + (16+(i*17))+ ")"
      })

  }

  var margins={x:0, y:32}

  updateLegenda = function(_g, d3Properties, viewState, viewIndex){

    if(viewIndex==0){
      margins.x= 0;
    }else{
      margins.x=stageWidth/2;
    }

    var gLegenda=_g.selectAll("#gLegenda").data([d3Properties]);

    gLegenda.enter().append("g")
      .attr("id", "gLegenda")
      .attr("transform", function(d){
          return "translate(" + margins.x + "," + margins.y + ")"
      })
      .each(function(d){
        var gL=d3.select(this);
        gL.append("text")
          .attr("id", "legenda-header")
          .attr("class", "legenda-header")
          .text(d.description);

        gL.append("text")
          .attr("id", "legenda-scale")
          .attr("class", "legenda-scale")
          .attr("y", 20)
          .text("Scaling :"+viewState.scale)

      })

    
      gLegenda.each(function(d){
        var gL=d3.select(this);
        setColorScaleGraph(gL, viewState, d3Properties);

        gL.select("#legenda-scale")
          .text("Scaling :"+viewState.scale)
      })

      gLegenda.exit().remove();

  }

  function setColorScaleGraph(_g, viewState, d3Properties){

    var scaleData=getScaleData(viewState.scale, d3Properties)

    var sL=_g.selectAll("#color-scale").data(scaleData.data, function(k){
      return k;
    }) 

    sL.enter().append("rect")
      .attr("id", "color-scale")
      .attr("x", function(k){
        return scaleData.xScale(k)*scaleW;
      })
      .attr("width", scaleData.width)
      .attr("height", 10)
      .attr("y", 28)
      .style("fill", d3Logic.getColorCode(5, d3Properties.utils.cbScheme) )
      .style("opacity", function(k){
        return scaleData.colorScale(k);
      })

    sL.attr("x", function(k, i){
        if(viewState.scale=="linear" || viewState.scale=="normalized"){
          return scaleData.xScale(k)*scaleW;
        }else{
          return i*scaleData.width;
        }
      })
      .attr("width", scaleData.width)
      .style("fill", function(k, i){
        if(viewState.scale=="linear" || viewState.scale=="normalized"){
          return d3Logic.getColorCode(5, d3Properties.utils.cbScheme);
        }else{
          return d3Logic.getColorCode(i, d3Properties.utils.cbScheme);
        }

      })
      .style("opacity", function(k){
        if(viewState.scale=="linear" || viewState.scale=="normalized"){
          return scaleData.colorScale(k);
        }else{
          return 1;
        }
      })

    sL.exit().remove();  



  }

  function getScaleData(_scale, d3Properties){

    //console.log("d3Properties ", d3Properties)

    var scaleData={data:[], xScale:{}, colorScale:{}, width:0};
    if(_scale=="linear"){
      for(var i=0; i<100; i++){

        scaleData.data.push(i)
      }
      scaleData.xScale=d3Properties.scales.linear;
      scaleData.colorScale=d3Properties.scales.linear;
      scaleData.width=scaleW/100;

    }else if(_scale=="normalized"){

      for(var i=d3Properties.extent[0]; i<d3Properties.extent[1]; i++){
        scaleData.data.push(i)
      }

      scaleData.width=scaleW/(d3Properties.extent[1]-d3Properties.extent[0]);

      scaleData.xScale=d3Properties.scales.normalized;
      scaleData.colorScale=d3Properties.scales.normalized;

    }else{
      for(var i=0; i<9; i++){
        scaleData.data.push(i)
      }

      scaleData.width=scaleW/9;

      scaleData.xScale=d3.scale.linear().domain([0, 100]).range([0,9]);
      scaleData.colorScale=d3Properties.scales.quantile;

    }

    return scaleData;
  }
  //g, d3Properties, "avg.", null, viewState, viewIndex
  

  setValue = function(_g, d3Properties, desc, value, viewState, viewIndex){

    if(viewIndex==0){
      margins.x= 0;
    }else{
      margins.x=stageWidth/2;
    }

    if(value==null){
      value=d3Properties.mean;
    }

    //console.log(viewState)
    var xPos=0;
    if(viewState.scale=="linear"){
      xPos=d3Properties.scales.linear(value)*scaleW;
    }else{
      xPos=d3Properties.scales.normalized(value)*scaleW;
    }
    
    var gValue=_g.selectAll("#value-legenda").data([value]);

    var label=desc+": "+value.toFixed(1);

    gValue.enter().append("g")
      .attr("id", "value-legenda")
      .attr("transform", function(d){
          return "translate(" + (margins.x+xPos) + "," + (margins.y+38) + ")"
      })
      .each(function(d){

        var gV=d3.select(this);
        gV.append("circle")
          .attr("r", 1)
          .attr("cy", -6)
          .style("fill", "#333");

         gV.append("line")
          .attr("x1",0)
          .attr("x2", 0)
          .attr("y1", -12)
          .attr("y2", 12)
          .style("stroke", "#333")

         gV.append("text")
          .attr("id", "legenda-value")
          .attr("y", 24)
          .text(desc+" :"+value)
          .style("text-anchor", "middle")
          .style("font-size", 12) 

      })

    gValue.attr("transform", function(d){
          return "translate(" + (margins.x+xPos) + "," + (margins.y+38) + ")"
      })
    .each(function(){
      var gV=d3.select(this);
      gV.select("#legenda-value").text(label)
    })  


  }

  mouseOverHandler = function(mouseOver, id){
    if(mouseOver){
      g.select("#label_"+id).style("font-weight", 600)
    }else{
      g.select("#label_"+id).style("font-weight", 200)
    }
  }


  this.init=init;
  this.update=update;
  this.mouseOverHandler=mouseOverHandler;
  this.updateLegenda=updateLegenda;
  this.setValue=setValue;

  
}