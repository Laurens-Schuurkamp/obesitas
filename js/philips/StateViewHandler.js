PHILIPS.StateViewHandler = function StateViewHandler() {
  
  console.log("Constructor StateViewHandler");

  var viewStates=[
    {state:"topoGeoMap", scale:"linear"},
    {state:"topoGeoMap", scale:"normalized"},
    {state:"topoGeoMap", scale:"quantile"},
    {state:"bubbleGeoMap", scale:"mixed"},
    // {state:"circlePack", scale:"quantile"},
    {state:"AxisBubbleGraph", scale:"mixed"},
    {state:"AxisRelationGraph", scale:"relation"}

  ];

  var activeDataIndex={"0":0, "1":1};

  var stateIndex=0;

  initViewStates = function(scope){

    svgStack.svg = d3.select('#d3-container').append("svg")
      .attr("width", stageWidth)
      .attr("height", stageHeight);

    svgStack.gAxis = svgStack.svg.append("g")
        .attr("id", "gAxis")
        .attr("width", stageWidth)
        .attr("height", stageHeight);   
    

    // _.each(scope.entrys, function(d, i){
    //   svgStack["viewIndex_"+i] = svgStack.svg.append("g")
    //     .attr("id", "viewIndex_"+i)
    //     .attr("width", stageWidth)
    //     .attr("height", stageHeight);
    // })

    svgStack["viewIndex_0"] = svgStack.svg.append("g")
        .attr("id", "viewIndex_0")
        .attr("width", stageWidth)
        .attr("height", stageHeight);

    svgStack["viewIndex_1"] = svgStack.svg.append("g")
        .attr("id", "viewIndex_1")
        .attr("width", stageWidth)
        .attr("height", stageHeight); 


    svgStack.gLegenda = d3.select("#d3-legenda").append("svg")
        .attr("id", "gLegenda")
        .attr("width", stageWidth)
        .attr("height", stageHeight);
        // .attr("height", stageHeight);


    d3Views.d3GeoTopoMap_0 = new PHILIPS.GeoTopoMap(svgStack["viewIndex_0"], 0, 0, stageWidth/2, stageHeight);
    d3Views.d3GeoTopoMap_1 = new PHILIPS.GeoTopoMap(svgStack["viewIndex_1"], stageWidth/2, 0, stageWidth/2, stageHeight);
    
    d3Views.d3GeoBubbles_0 = new PHILIPS.GeoBubbleGraph(svgStack["viewIndex_0"], 0, 0, stageWidth, stageHeight);
    d3Views.d3GeoBubbles_1 = new PHILIPS.GeoBubbleGraph(svgStack["viewIndex_1"], stageWidth/2, 0, stageWidth, stageHeight);

    d3Views.d3CirclePack_0 = new PHILIPS.CirclePack(svgStack["viewIndex_0"], 0, 0, stageWidth, stageHeight);
    d3Views.d3CirclePack_1 = new PHILIPS.CirclePack(svgStack["viewIndex_1"], stageWidth/2, 0, stageWidth, stageHeight);

    d3Views.AxisBubbleGraph_0 = new PHILIPS.AxisBubbleGraph(svgStack["viewIndex_0"], 0, 0, stageWidth, stageHeight);
    d3Views.AxisBubbleGraph_1 = new PHILIPS.AxisBubbleGraph(svgStack["viewIndex_1"], 0, 0, stageWidth, stageHeight);

    d3Views.AxisRelationGraph = new PHILIPS.AxisRelationGraph(svgStack["viewIndex_0"],svgStack["viewIndex_1"], 0, 0, stageWidth, stageHeight);

    d3Views.d3Legenda = new PHILIPS.Legenda(svgStack.gLegenda, 0, 0, legendaWidth, stageHeight);
    
    updateViewState(0);

  }

  updateViewState =  function(newIndex){

    var scope = d3Repository.updateDataSet(stateIndex);

    if(newIndex<0){
      stateIndex=viewStates.length-1;
    }else if(newIndex>viewStates.length-1){
      stateIndex=0;
    }else{
      stateIndex=newIndex;
    }

    d3Views.d3Legenda.update(scope, 1, true, false);

    //d3Views.AxisRelationGraph.update(scope, activeDataIndex, true, true);

    switch(viewStates[stateIndex].state) {
    case "topoGeoMap":
        console.log("state topoGeo")
        d3Views.d3GeoTopoMap_0.update(scope, activeDataIndex["0"], 0, true, false, viewStates[stateIndex]);
        d3Views.d3GeoTopoMap_1.update(scope, activeDataIndex["1"], 1, true, false, viewStates[stateIndex]);

        //d3Views.d3CirclePack_0.update(scope, activeDataIndex["0"], 0, true, true, {x:0, y:0}, viewStates[stateIndex]);
        //d3Views.d3CirclePack_1.update(scope, activeDataIndex["1"], 1, true, true, {x:stageWidth/2, y:0}, viewStates[stateIndex]);

         d3Views.d3GeoBubbles_0.update(scope, activeDataIndex["0"], 0, false, true, {x:0, y:0}, viewStates[stateIndex]);
        d3Views.d3GeoBubbles_1.update(scope, activeDataIndex["1"], 1, false, true, {x:stageWidth/2, y:0}, viewStates[stateIndex]);

        d3Views.AxisRelationGraph.update(scope, activeDataIndex, true, true, viewStates);

        break;
    case "bubbleGeoMap":
        console.log("state bubbleGeo")
        d3Views.d3GeoTopoMap_0.update(scope, activeDataIndex["0"], 0, false, false, viewStates[stateIndex]);
        d3Views.d3GeoTopoMap_1.update(scope, activeDataIndex["1"], 1, false, false, viewStates[stateIndex], viewStates[stateIndex]);

        d3Views.d3GeoBubbles_0.update(scope, activeDataIndex["0"], 0, true, false, {x:0, y:0}, viewStates[stateIndex]);
        d3Views.d3GeoBubbles_1.update(scope, activeDataIndex["1"], 1, true, false, {x:stageWidth/2, y:0}, viewStates[stateIndex]);

        d3Views.AxisBubbleGraph_0.update(scope, activeDataIndex["0"], 0, true, true, viewStates[stateIndex], "states");
        
        break;
    case "circlePack":
        console.log("circle pack")
        d3Views.d3GeoTopoMap_0.update(scope, activeDataIndex["0"], 0, true, true, viewStates[stateIndex]);
        d3Views.d3GeoTopoMap_1.update(scope, activeDataIndex["1"], 1, true, true);

        d3Views.d3CirclePack_0.update(scope, activeDataIndex["0"], 0, true, false, {x:0, y:0}, viewStates[stateIndex]);
        d3Views.d3CirclePack_1.update(scope, activeDataIndex["1"], 1, true, false, {x:stageWidth/2, y:0}, viewStates[stateIndex]);
    break; 
        case "AxisBubbleGraph":
        console.log("axis bubble graph")
        
        d3Views.d3GeoTopoMap_0.update(scope, activeDataIndex["0"], 0, true, true, viewStates[stateIndex]);
        d3Views.d3GeoTopoMap_1.update(scope, activeDataIndex["1"], 1, true, true, viewStates[stateIndex]);

        d3Views.AxisBubbleGraph_0.update(scope, activeDataIndex["0"], 0, true, false, viewStates[stateIndex], "states");
        d3Views.AxisBubbleGraph_1.update(scope, activeDataIndex["1"], 1, true, false, viewStates[stateIndex], "states");

        d3Views.AxisRelationGraph.update(scope, activeDataIndex, true, true, viewStates);

    break; 
        case "AxisRelationGraph":

        d3Views.AxisBubbleGraph_0.update(scope, activeDataIndex["0"], 0, true, true, viewStates[stateIndex], "states");
        d3Views.AxisRelationGraph.update(scope, activeDataIndex, true, false, viewStates);

    break;      

    default:
        d3Views.d3GeoTopoMap_0.update(scope, activeDataIndex["0"], 0, true, false, viewStates[stateIndex]);
        d3Views.d3GeoTopoMap_1.update(scope, activeDataIndex["1"], 1, true, false, viewStates[stateIndex]);
    }
    
  }

  updateSorting = function(scope, sortEntry){


    d3Views.AxisBubbleGraph_0.update(scope, activeDataIndex["0"], 0, true, false, viewStates[stateIndex], sortEntry);
    d3Views.AxisBubbleGraph_1.update(scope, activeDataIndex["1"], 1, true, false, viewStates[stateIndex], sortEntry);

  }



  document.onkeydown = checkKey;

  function checkKey(e) {

    var newIndex=false;
    e = e || window.event;
    if (e.keyCode == '38') {
        newIndex=stateIndex+1;
    }
    else if (e.keyCode == '40') {
        newIndex=stateIndex-1;
    }
    else if (e.keyCode == '37') {
       newIndex=stateIndex-1;
       return;
    }
    else if (e.keyCode == '39') {
       newIndex=stateIndex+1;
       return;
    }

    if(newIndex) updateViewState(newIndex);


  }


  this.initViewStates =initViewStates;
  this.updateViewState=updateViewState;
  this.updateSorting=updateSorting;

  
}