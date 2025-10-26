function initialise(){
    //Getting body from the local storage of the window
    var body = localStorage.getItem("body");
    //Parsing body to json
    var jsonBody = readJsonBody(body);
	var algorithm  = jsonBody.Algorithm;
    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    const ctx = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');

    const circlesArray = createCircles(getNodeConnections(jsonBody), 30, ctx);
    for(let i = 0; i < circlesArray.length; i++){
	    circlesArray[i].drawCircle();
    }
    const edges =  drawEdges(circlesArray, ctx, jsonBody);
    for(let i = 0; i < edges.length; i++){
	    edges[i].drawLine("orange");
    }
    writePseudocode(jsonBody.Pseudocode, ctxPseudocode, canvasPseudocode, -1);
	if(algorithm == "DFS"){
		initialiseStack(ctxADT, canvasADT);
	}
	else if(algorithm == "BFS"){
		initialiseQueue(ctxADT, canvasADT);
	}

	return circlesArray;
}



/**
 * 
 * @param {*} min - The minimum value returned by the random number generator
 * @param {*} max - The maximum value returned by the random number generator
 * @param {*} radius - The radius of the circle required ...
 * @returns 
 */
function getRandomCoordinates(min, max, radius) {
  return Math.random() * (max - (min + radius + 1)) + min;
}

function drawEdges(circlesArray, ctx, jsonBody){
	var NodeConnections = getNodeConnections(jsonBody);
	var keys = Object.keys(NodeConnections);
	var edges = [];
	var length = keys.length;
	for(let i = 0; i<length; i++){
		var key = keys[i];
		var valuesList = NodeConnections[key];
		var node1 = getCircle(key, circlesArray);
		for (let j = 0; j < valuesList.length; j++) {
			var node2 = getCircle(valuesList[j].Name, circlesArray);
			edges.push(new Line(ctx, node1.x, node1.y, node2.x, node2.y));
		}
	}
	return edges;
} 

function getCircle(key, circlesArray){
	var length = circlesArray.length;
	for(let i = 0; i < length; i++){
		if(circlesArray[i].name == key){
			return circlesArray[i];
		}		
	}
}

function createCircles(nodeConnections, radius, ctx){
	const circles = [];
	var length = Object.keys(nodeConnections).length;
	var keys = Object.keys(nodeConnections);
	for(let i = 0; i < length; i++){
		circles.push(new Circle(keys[i], ctx, getRandomCoordinates(0,canvasGraph.width, radius), getRandomCoordinates(0,canvasGraph.height, radius) , radius))
	}
	return circles;
}

function getNodeConnections(jsonBody){
	return jsonBody.Graph.NodeConnections;
}

function readJsonBody(body){
	//Parsing the body into Json form
	const jsonBody = JSON.parse(body);
	// var numberOfNodes = jsonBody.Graph.nodesList.length;
	// var nodeConnections = jsonBody.Graph.NodeConnections;
	// var pseudocode = jsonBody.Pseudocode;
	// var stepsList = jsonBody.StepsList;
	// console.log();
	// console.log(pseudocode);
	return jsonBody;
}

function initialiseStack(ctxADT, canvasADT){
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	ctxADT.beginPath();
	//Draw Stack
	ctxADT.rect(canvasADT.width*(0.85), canvasADT.height*0.1, canvasADT.width*0.12, canvasADT.height*0.82);
	ctxADT.stroke();

	ctxADT.beginPath();
	//Draw visited Queue
	ctxADT.rect(canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.6, canvasADT.height*0.23);
	ctxADT.stroke();
}

function initialiseQueue(ctxADT, canvasADT){
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);
	ctxADT.beginPath();
	//Draw visited Queue
	ctxADT.rect(canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.6, canvasADT.height*0.23);
	ctxADT.stroke();
}

function initialiseDijkstraTable(){
    //TODO table for Dijkstra
}
