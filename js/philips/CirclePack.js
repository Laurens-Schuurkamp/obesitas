PHILIPS.CirclePack = function CirclePack(_g, _x, _y, _width, _height) {
  
  console.log("Constructor CirclePack");

  var g=_g;
  var width=_width;
  var height=_height;
  var posX=offstetX=_x;
  var posY=offstetY=_y;

  var pSize=height; 

  init = function(){

  }

  function update(scope, dataIndex, viewIndex, _fill, _exit, offset){

    offsetX=offset.x;
    offsetY=offset.y;

    var d3Properties=scope.entrys[dataIndex].d3Properties;    
    updateCirclePack(scope.data, viewIndex, d3Properties, _exit);
  }

  function updateCirclePack(data, viewIndex, d3Properties, _exit){

      //g.selectAll(".bubbles").data([]).exit().remove();
      if(height>width/2)pSize=width/2;
      pSize=pSize*0.8;
      var pack = d3.layout.pack()
        .size([pSize, pSize])
        .padding(6)
        .value(function(d) { 
          var value=d3Properties.rateBy.stateId.get(d.id);
          if(!value)value=1;
          return value; 
        })

    var topoData=topojson.feature(data.topo, data.topo.objects.states).features;
    if(_exit) topoData=[];
    var dataPack={children:topoData}; 
    var dataNodes=pack.nodes(dataPack);
    if(_exit) dataNodes=[];
      
    var node = g.selectAll("#bubbles-"+viewIndex).data(dataNodes, function(d){return d.id});

    node.enter().append("circle")
            .attr("class", "bubbles")
            .attr("id", function(d){
              if(d.children){
                return "#pack-container-"+viewIndex;
                
              }else{
                return "#bubbles-"+viewIndex;
              }
              
            })
            .attr("r", function(d){
              return 0;
            })
            .style("fill", function(d){
              if(d.children){
                return colorbrewer[d3Properties.utils.cbScheme]['9'][0]
              }else{
                var cValue=d3Properties.scaleQuantize(d3Properties.rateBy.stateId.get(d.id));
                return colorbrewer[d3Properties.utils.cbScheme]['9'][ cValue]
              }
            })
            .style("stroke", "none")
            .style("stroke-width", 1+"px")
            .style("opacity", function(d){
              if(d.children){
                return 1;
              }else{
                return 1;
              }
            })
            .on("click", function(d){
              console.log(d)
            })        
        
        node.transition()
            .duration(500)
            .attr("cx", function(d) {
              var ox=0;
              if(viewIndex==0){
                ox=-pSize-(0.05*pSize)
              }else{
                ox=0+(0.05*pSize)
              } 
              return (stageWidth/2)+d.x+ox;
              //return d.x+offsetX+ox; 
            })
            .attr("cy", function(d){
              return  d.y+offsetY+(0.25*(height/2));
            })
            .style("fill", function(d){ 
              if(d.children){
                return "none"
              }else{
                var cValue=d3Properties.scaleQuantize(d3Properties.rateBy.stateId.get(d.id));
                return d3Logic.getColorCode(cValue, d3Properties.utils.cbScheme)
              }
            })
            .style("stroke", function(d){ 
              if(d.children){
                return colorbrewer[d3Properties.utils.cbScheme]['9'][8]
              }else{
                return "none"
              }
            })
            .style("stroke-width", function(d){ 
              if(d.children){
                return 0.25;
              }else{
                return 0;
              }
            })

            .attr("r", function(d) { return d.r; })
            // .each("end", function() {
            //     console.log("end function");
            // })

      // node.each(function(d, i){
      //     if(!d.children) {
      //       var orig = d3.select(this);
      //       var origNode = orig.node();
      //       var dupe = d3.select(origNode.parentNode.appendChild(origNode.cloneNode(true), origNode.nextSibling));
      //         dupe.on("mouseover", function(d){
      //             d3Views.d3Legenda.mouseOverHandler(true, d.id);
      //         }) 
      //         .on("mouseout", function(d){
      //             d3Views.d3Legenda.mouseOverHandler(false, d.id);
      //         })

      //       orig.remove();
      //     }

      //   })    

                
        node.exit().transition()
          .attr("r", 0)
          .remove();

      if(_exit){
        svgStack["viewIndex_"+viewIndex].selectAll(".bubbles").data([]).exit().transition(250)
          .style("opacity", 0)
          .remove();
      }    

  }

  function moveToFront(el){

  }


  this.init=init;
  this.update=update;

  
}