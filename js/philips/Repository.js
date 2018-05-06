PHILIPS.Repository = function Repository() {
  
  console.log("Constructor Repository");
  var scope={};
  init = function(){
    getData();
  }

  function getData() {
    queue()
      .defer(d3.json, "data/us.json")
      .defer(d3.tsv, "data/us-state-names.tsv")
      .defer(d3.tsv, "data/unemployment.tsv")
      .defer(d3.csv, "data/population-us-obesity.csv")
      .defer(d3.csv, "data/obesity-education-health_expenditures_capita-population.csv")
      .await(setData); 
  }

  function setData(error, topoData, stateNamesData, unemploymentData, populationData, obesity_education){

    if (error) throw error;
    console.log("queue loaded")

    scope.data={
      topo:topoData,
      stateNames:stateNamesData,
      unemployment:unemploymentData,
      population:populationData,
      obesity_education:obesity_education
    }
    scope.entrys=[
        {entry:"obesity", d3Properties:{}, unit:"%", colors:"Oranges"},
        {entry:"education", d3Properties:{}, unit:"%", colors:"Blues"},
        {entry:"health_expenditures_capita", d3Properties:{}, unit:"#", colors:"Greens"},
        {entry:"population", d3Properties:{}, unit:"#", colors:"Purples"}
    ]


    // confert id-strings to NR's
    _.each(scope.data.stateNames, function(d){
        d.id=+d.id;
    })

    // link states to id population
    _.each(scope.data.population, function(d,i){
      var state=_.find(scope.data.stateNames, { 'name': d.state });
      d.id=+state.id;   
    })

    // set state names in topo set
    _.each(scope.data.topo.objects.states.geometries, function(d){
       var state=_.find(scope.data.stateNames, { 'id': d.id });
       d.properties={};

       d.properties.name=state.name;
       d.properties.code=state.code;
    })

    // scope.data.topo.objects.states.geometries =_.sortBy(scope.data.topo.objects.states.geometries, function(d) {
    //   return d.properties.name;
    // });

    // conver strings to nr
    _.each(scope.data.obesity_education, function(d){
      d.id=+d.id;
      d.obesity=+d.obesity;
      d.education=+d.education;
      d.health_expenditures_capita=+d.health_expenditures_capita;
      d.population=+d.population;

    });

    //setD3Properties();
    stateViewHandler.initViewStates(scope);
    

  }

  function setD3Properties(){
    _.each(scope.entrys, function(d, i){
        d.d3Properties=d3Logic.getD3Properties(scope.data.obesity_education, d.entry, d.unit, i);
        d.d3Properties.rateBy=d3Logic.getDataRelations(scope.data.obesity_education, d.entry);
    });

    return true;
  }


  updateDataSet = function(){
    var props=setD3Properties();

    _.each(scope.entrys, function(d){
        _.each(scope.data.topo.objects.states.geometries, function(k){
          var value=d.d3Properties.rateBy.stateId.get(k.id);
          if(!value)value=1;
          if(!k.properties.values)k.properties.values={}
          k.properties.values[d.entry]=value;
          if(!k.properties.values[d.entry].value)k.properties.values[d.entry].value=0;

        })
    });
    return scope;

  }


  this.init = init;
  this.updateDataSet = updateDataSet;
  
}