function initialise(){
    //Getting the body from the local storage of the window
    var body = localStorage.getItem("body");
    //Parsing body to json
    var jsonBody = readJsonBody(body);
	//Reading the algorithm from the json
	var algorithm  = jsonBody.Algorithm;
    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    const ctx = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');

	//Creating the array of circles, which represent the nodes
    const circlesArray = createCircles(getNodeConnections(jsonBody), 30, ctx);
    for(let i = 0; i < circlesArray.length; i++){
	    circlesArray[i].drawCircle();
    }
    const edges =  initialiseEdges(circlesArray, ctx, jsonBody);
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
	else if(algorithm == "Dijkstra"){
		initialiseDijkstraTable(ctxADT, canvasADT, circlesArray);
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

/**
 * Taking the nodeConnections part of the jsonBody in order to initialise the edges
 * between the nodes which have a connection (edge)
 */

function initialiseEdges(circlesArray, ctx, jsonBody){
	//Reading nodeConnections from json
	var NodeConnections = getNodeConnections(jsonBody);
	var nodeKeys = Object.keys(NodeConnections);
	//Initialising a list for the edges 
	var edges = [];
	
	var length = nodeKeys.length;
	for(let i = 0; i<length; i++){
		var nodeKey = nodeKeys[i];
		var valuesList = NodeConnections[nodeKey];
		//Creating a circle for each node in the graph 
		var node1 = getCircle(nodeKey, circlesArray);
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

//Function to create an array of circles representing the nodes
function createCircles(nodeConnections, radius, ctx){
	//Initialising a list of circles
	const circles = [];
	/**
	 * Retrieving the key nodes from the node connections part of the json
	 * The connections are arranged in the format of a adjacency list
	 * where one node is the key and all its neighbours are in an array
	 * which is its value
	 */	
	var keys = Object.keys(nodeConnections);
	/**
	 * Getting the number of nodes in the graph - since all the nodes will 
	 * be a key at some point, it is enough to just get the length of the keys
	 * to find out the number of nodes
	 */
	var length = Object.keys(nodeConnections).length;
	var xCent;
	var yCent;
	for(let i = 0; i < length; i++){
		//Foreach node, a circle is created and added to the circles list
		var coordinatesCheck = false
		while(!coordinatesCheck){
			xCent = getRandomCoordinates(radius,canvasGraph.width - radius, radius);
			yCent = getRandomCoordinates(radius,canvasGraph.height - radius, radius);
			coordinatesCheck = centreCoordinatesValidator(xCent, yCent, radius, circles);
		}
		circles.push(new Circle(keys[i], ctx, xCent, yCent , radius,))
	}
	return circles;
}

// function circlesCopy(circles){
// 	circlesCopyList =[];
// 	for(var circle of circles){
// 		circlesCopy.push(circle);
// 	}
// }

//Validating the coordinates of the centre to see if the nodes are suitably apart
function centreCoordinatesValidator(xCent, yCent, radius, circles){
	for(var circle of circles){
		var pythag = Math.pow((circle.x - xCent), 2) + Math.pow((circle.y - yCent), 2);
		var minimumPixeldistance = 900;
		if(pythag < minimumPixeldistance){
			return false;
		}
	}
	return true;
}

function getNodeConnections(jsonBody){
	return jsonBody.Graph.NodeConnections;
}

function readJsonBody(body){
	//Parsing the body into Json form
	const jsonBody = JSON.parse(body);
	var numberOfNodes = jsonBody.Graph.nodesList.length;
	var nodeConnections = jsonBody.Graph.NodeConnections;
	var pseudocode = jsonBody.Pseudocode;
	var simulationSteps = jsonBody.SimulationSteps;
	console.log();
	console.log(pseudocode);
	console.log(simulationSteps);
	return jsonBody;
}

function initialiseStack(ctxADT, canvasADT){
	//Clearing the canvas before remaking the stack
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
	//Clearing the canvas before remaking the queue
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	ctxADT.beginPath();
	//Draw visited Queue
	ctxADT.rect(canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.6, canvasADT.height*0.23);
	ctxADT.stroke();
}

function initialiseDijkstraTable(ctxADT, canvasADT, circlesArray){
    //TODO table for Dijkstra
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);
	
	var tableData;
	for(let i = 0; i < circlesArray.length; i++){
		i == 0 ? tableData.push({node : circle.name, dist : 0, prev : ""}) : tableData.push({node : circle.name, dist : "∞", prev : ""})
	}

	buildDijkstraTable(tableData, ctxADT, canvasADT);
}

/**
 * 
 * @param {*} tableData
 * @param {*} canvasADT 
 * @param {*} ctxADT 
 * Function for building the table for the Dijkstra Algorithm
 * There will be three columns: Node, Distance From Source Node, Previous Node
 */
function buildDijkstraTable(tableData, canvasADT, ctxADT){
	var widthPadding = canvasADT.width * 0.1
	var heightPadding = canvasADT.height * 0.1

	var startX = widthPadding;
	var endX = canvasADT.width - widthPadding;
	var startY = heightPadding;
	var endY = canvasADT.height - heightPadding;

	tableWidth = canvasADT.width - 2 * padding;
	tableHeight = canvasADT.height - 2 * padding;

	const rows = tableData.length + 1;
	const columns = ["Node", "Distance From Source Node", "Previous Node"];
	const cellWidth = tableWidth / columns.length;
	const cellHeight = tableHeight / rows;
	
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);
	ctxADT.textAlign = "center";
	ctxADT.lineWidth = 2;
	ctxADT.strokeStyle = "black";

	//Drawing the table using strokeRect, where each rectangle is a cell
	for(let rowIndex = 0; rowIndex < rows; rowIndex++){
		for(let cellIndex = 0; cellIndex < columns; cellIndex++){
			var x = startX + cellIndex * cellWidth;
			var y = startY + rowIndex * cellHeight;
			ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		}
		
		var text = "";
		ctxADT.fillStyle = "yellow";
		
		if(rowIndex == 0){
			text = columns[cellIndex];
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 16px";
		}
	}
}
