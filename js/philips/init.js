var PHILIPS = PHILIPS || {};

var cbScheme="Blues";
var stateViewHandler, d3Logic, d3Repository;

// global properties for stateViewHandler
var d3Views={};
var svgStack={};

var stageWidth, stageHeight, legendaWidth;

function init(){

	console.log("init");

	window.addEventListener('resize', onWindowResize, false);
	onWindowResize(null); 
	
    stateViewHandler = new PHILIPS.StateViewHandler();
		
	d3Logic = new PHILIPS.D3Logic();
	
	d3Repository = new PHILIPS.Repository();
	d3Repository.init();

}

function onWindowResize( event ) {
	console.log('resize');
	stageWidth = document.getElementById("d3-container").offsetWidth;
	stageHeight = document.getElementById("d3-container").offsetHeight;
	legendaWidth= document.getElementById("d3-legenda").offsetWidth;

};






