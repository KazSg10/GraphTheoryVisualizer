function initialise(){
    //Getting the body from the local storage of the window
    var body = localStorage.getItem("body");
    //Parsing body to json
    var jsonBody = readJsonBody(body);
	//Reading the algorithm from the json
	var algorithm  = localStorage.getItem('algorithm');
    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    const ctx = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');

	//Creating the array of circles, which represent the nodes
    const circlesArray = createCircles(localStorage.getItem('nodesList'), 30, ctx);
    for(let i = 0; i < circlesArray.length; i++){
	    circlesArray[i].drawCircle();
    }
    const edges =  initialiseEdges(circlesArray, ctx, algorithm);
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

//Splitting up the json body into its different components and storing it in the local storage
function readJsonBody(body){
	//Parsing the body into Json form
	const jsonBody = JSON.parse(body);
	localStorage.setItem('jsonBody', jsonBody);
	var graph = jsonBody.Graph;
	var pseudocode = jsonBody.pseudocode;
	localStorage('pseudocode', pseudocode);
	localStorage.setItem('Graph', graph);
	var algorithm = jsonBody.Algorithm;
	localStorage.setItem('algorithm', algorithm);
	var numberOfNodes = jsonBody.Graph.nodesList.length;
	localStorage.setItem('numberOfNodes', numberOfNodes);
	var nodeConnections = jsonBody.Graph.NodeConnections;
	localStorage.setItem('nodeConnections', nodeConnections);
	var pseudocode = jsonBody.Pseudocode;
	localStorage.setItem('pseudocode', pseudocode);
	var simulationSteps = jsonBody.SimulationSteps;
	localStorage.setItem('simulationSteps', simulationSteps);
	var edgeList = graph.edgeList;
	localStorage.setItem('edgeList', edgeList);
	var nodesList = graph.nodesList;
	localStorage('nodesList', nodesList);

	return jsonBody;
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

function initialiseEdges(circlesArray, ctx, algorithm){
	nodeConnections = localStorage.getItem('nodeConnections');
	var nodeKeys = Object.keys(nodeConnections);
	//Initialising a list for the edges 
	var edges = [];
	var weight = -1;
	var length = nodeKeys.length;
	for(let i = 0; i<length; i++){
		var nodeKey = nodeKeys[i];
		var valuesList = nodeConnections[nodeKey];
		//Creating a circle for each node in the graph 
		var node1 = getCircle(nodeKey, circlesArray);
		for (let j = 0; j < valuesList.length; j++) {

			var node2 = getCircle(valuesList[j].name, circlesArray);
			if(algorithm == "Dijkstra"){
				edgesList = localStorage.getItem('edgeList');
				for(let edgeIndex = 0; edgeIndex < edgesList.length; edgeIndex++){
					if(node1.name == edgesList[edgeIndex].node1.name && node2.name == edgesList[edgeIndex].node2.name){
						weight = edgesList[edgeIndex].weight;
						break;
					}			
				}
				// for(var [direction, node1, node2, weight] in edgesList){
				// 	if(node1 == edge.node1 && node2 == edge.node2){
				// 		weight = edge.weight;
				// 	}
				// }	
			}
		edges.push(new Line(ctx, node1.x, node1.y, node2.x, node2.y, weight));			
		}
	return edges;
	} 
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
function createCircles(nodesList, radius, ctx){
	//Initialising a list of circles
	const circles = [];
	
	var xCent;
	var yCent;
	for(let i = 0; i < nodesList.length; i++){
		//Foreach node, a circle is created and added to the circles list
		var coordinatesCheck = false
		while(!coordinatesCheck){
			xCent = getRandomCoordinates(radius,canvasGraph.width - radius, radius);
			yCent = getRandomCoordinates(radius,canvasGraph.height - radius, radius);
			coordinatesCheck = centreCoordinatesValidator(xCent, yCent, radius, circles);
		}
		circles.push(new Circle(nodesList[i].name, ctx, xCent, yCent , radius,))
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
		var minimumPixeldistance = 10000;
		if(pythag < minimumPixeldistance){
			return false;
		}
	}
	return true;
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
	
	var tableData = [];
	for(let i = 0; i < circlesArray.length; i++){
		i == 0 ? tableData.push({node : circlesArray[i].name, dist : 0, prev : ""}) : tableData.push({node : circlesArray[i].name, dist : "\u221E", prev : ""})
	}

	buildDijkstraTable(tableData, canvasADT, ctxADT);
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
	//Padding around the table
	var widthPadding = canvasADT.width * 0.1
	var heightPadding = canvasADT.height * 0.1

	//The start and end coordinates for the table
	var startX = widthPadding;
	var endX = canvasADT.width - widthPadding;
	var startY = heightPadding;
	var endY = canvasADT.height - heightPadding;

	tableWidth = canvasADT.width - 2 * widthPadding;
	tableHeight = canvasADT.height - 2 * heightPadding;

	//The number of rows is tableData.length + 1 since the first row is for the headers
	const rows = tableData.length + 1;
	//Assigning the headers to an array
	const columns = ["Node", "Distance From Source Node", "Previous Node"];
	//Calculating cell width and height
	const cellWidth = tableWidth / columns.length;
	const cellHeight = tableHeight / rows;
	
	//Clearing the canvas before creating the table
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);
	ctxADT.strokeStyle = "black";

	//Drawing the table using strokeRect, where each rectangle is a cell
	for(let rowIndex = 0; rowIndex < rows; rowIndex++){
		for(let cellIndex = 0; cellIndex < columns.length; cellIndex++){
			var x = startX + cellIndex * cellWidth;
			var y = startY + rowIndex * cellHeight;
			ctxADT.strokeRect(x, y, cellWidth, cellHeight);

			var text = "";
			
			//If rowIndex is 0, then the cells in the first row will have the headers written in them
			if(rowIndex == 0){
				ctxADT.textAlign = "center";
				ctxADT.lineWidth = 2;
				text = columns[cellIndex];
				ctxADT.fillStyle = "brown";
				ctxADT.font = "bold 16px Arial";
			//If the row index is not 0, the values in the tableData will be written in the cell	
			}else{
				switch(cellIndex){
					case 0:
						text = tableData[rowIndex - 1].node;
						break;	
					case 1:
						text = tableData[rowIndex - 1].dist;	
						break;
					case 2:
						text = tableData[rowIndex - 1].prev;	
				}
			}
			//Centering the values in the cells
			ctxADT.fillText(text, x + cellWidth / 2, y + cellHeight / 2);
		}
		
		
	}
}

