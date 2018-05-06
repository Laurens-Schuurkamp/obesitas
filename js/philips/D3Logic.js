PHILIPS.D3Logic = function D3Logic() {
  
  console.log("Constructor D3Logic");

  init = function(){

  }

  getD3Properties = function(data, entry, unit, viewIndex){

    var d3Properties={};
    d3Properties.utils=getD3Utils(entry);


    if(unit!="%"){
      var total=0;
      _.each(data, function(d){
          if(!d[entry])d[entry]=0;
          total+=d[entry];
      })

      console.log("total :"+total)
    }

    var extent=d3.extent(data, function(d){ return +d[entry]})
    var mean = d3.mean(data, function(d){ return +d[entry]})
    
    d3Properties.scales={};
    d3Properties.scales.linear=d3.scale.linear();
    if(unit=="%"){
      d3Properties.scales.linear.domain([0, 100]).range([0,1]);
    }else{
      d3Properties.scales.linear.domain([0, extent[1]]).range([0,1]);
    }

    d3Properties.scales.normalized=d3.scale.linear().domain([extent[0], extent[1]]).range([0,1]);
    d3Properties.scales.quantile=d3.scale.quantile().domain([extent[0], extent[1]]).range(d3.range(d3Properties.utils.cbSteps));

    d3Properties.extent = extent;
    d3Properties.mean=mean;


    d3Properties.utils=getD3Utils(entry, viewIndex);
    d3Properties.description="Data description";

    if(entry=="obesity"){
      d3Properties.description="Perc. Obesity (%)"
    }else if (entry=="education") {
      d3Properties.description="Perc. Higher Education (Bachelor+)";
    }else if (entry=="health_expenditures_capita") {
      d3Properties.description="Health Expenditure per Capita ($)";
    }else if (entry=="population") {
      d3Properties.description="Population (nr.)";
    }

    return d3Properties;
    
  }

  getD3Utils = function(entry, viewIndex){

    var utils={
      cbScheme:"Greys",
      cbSteps:9,
      twTime:500,
      width:1024,
      height:768
    }

    if(viewIndex==0){
      utils.cbScheme="Oranges";
    }else if(viewIndex==1){
      utils.cbScheme="Blues";
    }else if(viewIndex==2){
      utils.cbScheme="Greens";
    }else{
      utils.cbScheme="Purples";
    }

    return utils;

  } 

  getColorCode = function(cValue, cbScheme){

      if(!cValue){
        return colorbrewer[cbScheme]['9'][0];
      }else{
        return colorbrewer[cbScheme]['9'][cValue]
      }

  }

  getDataRelations = function(data, entry){
    
    var rateByStateName = d3.map();
    var rateByStateId = d3.map();

    _.each(data, function(d){
      rateByStateName.set(d.state, +d[entry]);
      rateByStateId.set(d.id, +d[entry]);
    });

    var rateBy={
      stateName:rateByStateName,
      stateId:rateByStateId
    };

    return rateBy;

  }

  sortDataSet = function(scope, entry, order){
    
    var data=_.sortBy(scope.data.topo.objects.states.geometries, function(d) {
      if(entry=="states"){
        return d.properties.name;
      }else {
        if(entry==scope.entrys[0].entry){
          return d.properties.values[scope.entrys[0].entry];
        }else if(entry==scope.entrys[1].entry){
          return d.properties.values[scope.entrys[1].entry];
          
        }else if(entry==scope.entrys[2].entry){
          return d.properties.values[scope.entrys[2].entry];
          
        }else if(entry==scope.entrys[3].entry){
          return d.properties.values[scope.entrys[3].entry];
          
        }
        
      }
      
    });
    if(entry!="states"){
      data.reverse();
    }
    return data;

  }

  scaleValue = function(type, scales){
    if(type=="linear"){

    }else if(type=="normilzed"){

    }else if(type=="quantile"){

    }

  }

  setBubbleProperties = function(d){

  }

  this.init=init;
  this.getD3Properties=getD3Properties;
  this.getDataRelations=getDataRelations;
  this.getColorCode=getColorCode;
  this.sortDataSet=sortDataSet;
  this.scaleValue=scaleValue;
  this.setBubbleProperties=setBubbleProperties;
  
}