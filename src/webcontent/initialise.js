function initialise(){
    //Getting the body from the local storage of the window
    var body = localStorage.getItem("body");
    //Parsing body to json
	readJsonBody(body);
	//Reading the algorithm from the json
	var algorithm  = JSON.parse(localStorage.getItem('algorithm'));
    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    const ctxGraph  = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');

	//Creating the array of circles, which represent the nodes
	var radius = 30
    const circlesArray = createCircles(JSON.parse(localStorage.getItem('nodesList')), radius, ctxGraph );
    for(let i = 0; i < circlesArray.length; i++){
	    circlesArray[i].drawCircle("yellow");
    }
    const edges =  initialiseEdges(circlesArray, ctxGraph , algorithm);
    for(let i = 0; i < edges.length; i++){
	    edges[i].drawLine("black", radius);
    }
    writePseudocode(JSON.parse(localStorage.getItem('pseudocode')), ctxPseudocode, canvasPseudocode, -1);
	if(algorithm == "DFS"){
		drawDFSCanvas(ctxADT, canvasADT, [], []);
	}
	else if(algorithm == "BFS"){
		drawBFSCanvas(ctxADT, canvasADT, [], []);
	}
	else if(algorithm == "Dijkstra"){
		var tableData = [];
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
 * Splitting up the json body into its different components and storing it in the local storage
 * JSON.stringify required because local storage can only store strings
 * When converting back to individual components which can be used, JSON.parse is required
 */
function readJsonBody(body){
	//Parsing the body into Json form
	const jsonBody = JSON.parse(body);
	localStorage.setItem('jsonBody', JSON.stringify(jsonBody));
	console.log(jsonBody);
	var pseudocode = jsonBody.Pseudocode;
	localStorage.setItem('pseudocode', JSON.stringify(pseudocode));
	console.log(pseudocode);
	var graph = jsonBody.Graph;
	localStorage.setItem('Graph', JSON.stringify(graph));
	var algorithm = jsonBody.Algorithm;
	console.log(algorithm);
	localStorage.setItem('algorithm', JSON.stringify(algorithm));
	var numberOfNodes = graph.nodesList.length;
	localStorage.setItem('numberOfNodes', JSON.stringify(numberOfNodes));
	var nodeConnections = graph.NodeConnections;
	localStorage.setItem('nodeConnections', JSON.stringify(nodeConnections));
	var simulationSteps = jsonBody.simulationSteps;
	localStorage.setItem('simulationSteps', JSON.stringify(simulationSteps));
	var nodesList = graph.nodesList;
	localStorage.setItem('nodesList', JSON.stringify(nodesList));
	console.log(nodesList);
	var edgeList = graph.edgeList;
	localStorage.setItem('edgeList', JSON.stringify(edgeList));
	var sourceNode= jsonBody.SourceNode;
	localStorage.setItem('sourceNode', JSON.stringify(sourceNode));
}

/**
 * Taking the nodeConnections part of the jsonBody in order to initialise the edges
 * between the nodes which have a connection (edge)
 */



function initialiseEdges(circlesArray, ctxGraph , algorithm){
	var edgeList = JSON.parse(localStorage.getItem('nodeConnections'));
	var keys = Object.keys(edgeList);
	//Initialising a list for the edges 
	var edges = [];
	var weight = -1;
	var length = keys.length;
	for(let i = 0; i<length; i++){
		var key = keys[i];
		var valuesList = edgeList[key];
		//Getting the circle which is in the edge
		var node1 = getCircle(key, circlesArray);
		for (let j = 0; j < valuesList.length; j++) {
			//Getting the circle which is in the edge
			var node2 = getCircle(valuesList[j].name, circlesArray);
			if(algorithm == "Dijkstra"){
				edgesList = JSON.parse(localStorage.getItem('edgeList'));
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
		edges.push(new Line(ctxGraph , node1.x, node1.y, node2.x, node2.y, weight));			
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
function createCircles(nodesList, radius, ctxGraph ){
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
		circles.push(new Circle(nodesList[i].name, ctxGraph , xCent, yCent , radius,))
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
		var pythag = distance(xCent, circle.x, yCent, circle.y);
		var minimumPixeldistance = 100;
		if(pythag < minimumPixeldistance){
			return false;
		}
	}

	// for(let i = 0; i < circles.length; i++){
	// 	for(let j = 0; j < circles.length; j++){
	// 		if(circles[i] != circles[j]){
	// 			if(distance(xCent, circles[i].x, yCent, circles[i].y) < distanceBetweenTwoCircles(circles[i], circles[j])/2 || distance(xCent, circles[j].x, yCent, circles[j].y) < distanceBetweenTwoCircles(circles[i], circles[j])/2){
	// 				return false;
	// 			}
	// 		}
	// 	}
	// }
	return true;
}

function distance(x1, x2, y1, y2){
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function distanceBetweenTwoCircles(circle1, circle2){
	return Math.sqrt(circle1.x * circle1.x + circle2.y * circle2.y);
}


/**
 * Following function are used to redraw the canvasADT for DFS and BFS
*/
function drawDFSCanvas(ctxADT, canvasADT, stack, visited){
	//Clearing the canvas before remaking the queue
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	numberOfNodes = JSON.parse(localStorage.getItem('numberOfNodes'));

	drawDFSStack(ctxADT, canvasADT, numberOfNodes, stack);
	drawDFSVisited(ctxADT, canvasADT, numberOfNodes, visited);
}

function drawBFSCanvas(ctxADT, canvasADT, queue, visited){
	//Clearing the canvas before remaking the queue
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	numberOfNodes = JSON.parse(localStorage.getItem('numberOfNodes'));

	drawBFSQueue(ctxADT, canvasADT, numberOfNodes, queue);
	drawBFSVisited(ctxADT, canvasADT, numberOfNodes, visited);
}

function drawBFSQueue(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Queue
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var queueWidth = width * 0.3;
	var queueHeight = height * 0.8;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.1
	var startY = height*0.1;
	var y;

	var text;

	for(let rowIndex = 0; rowIndex < numberOfNodes + 1; rowIndex++){
		y = startY + rowIndex * cellHeight;
		ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		if(rowIndex == 0){
			ctxADT.textAlign = "center";
			ctxADT.lineWidth = 2;
			text = "Queue";
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 16px Arial";
		}
		else{
			text = nodes[rowIndex - 1] ? nodes[rowIndex - 1] :  "";
		}
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

function drawBFSVisited(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Visited list
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var queueWidth = width * 0.3;
	var queueHeight = height * 0.8;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.6;
	var startY = height*0.1;
	var y;

	var text;

	for(let rowIndex = 0; rowIndex < numberOfNodes + 1; rowIndex++){
		y = startY + rowIndex * cellHeight;
		ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		if(rowIndex == 0){
			ctxADT.textAlign = "center";
			ctxADT.lineWidth = 2;
			text = "Visited";
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 16px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
		}
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

function drawDFSStack(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Stack
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var queueWidth = width * 0.3;
	var queueHeight = height * 0.8;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.1
	var startY = height*0.1;
	var y;

	var text;

	for(let rowIndex = 0; rowIndex < numberOfNodes + 1; rowIndex++){
		y = startY + rowIndex * cellHeight;
		ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		if(rowIndex == 0){
			ctxADT.textAlign = "center";
			ctxADT.lineWidth = 2;
			text = "Stack";
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 16px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
			
		}
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

function drawDFSVisited(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Visited list
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;
	var queueWidth = width * 0.3;
	var queueHeight = height * 0.8;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.6;
	var startY = height*0.1;
	var y;

	var text;

	for(let rowIndex = 0; rowIndex < numberOfNodes + 1; rowIndex++){
		y = startY + rowIndex * cellHeight;
		ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		if(rowIndex == 0){
			ctxADT.textAlign = "center";
			ctxADT.lineWidth = 2;
			text = "Visited";
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 16px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
		}
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

function initialiseDijkstraTable(ctxADT, canvasADT, circlesArray){
	buildDijkstraTable(buildTableData(null, circlesArray), canvasADT, ctxADT);
}

/**
 * Function for building the data for the Dijkstra table
 * @param {*} tableChangedRowData - This will be the row of the table that has been updated
 * This will be null in the beginning
 * @param {*} circlesArray 
 * 
 */
function buildTableData(tableChangedRowData, circlesArray){
	var newTableData = [];
	if(tableChangedRowData == null){
		for(let i = 0; i < circlesArray.length; i++){
			if(circlesArray[i].name == JSON.parse(localStorage.getItem('sourceNode')).name){
				tableData.push({node : circlesArray[i].name, dist : 0, prev : ""})
			}else{
				tableData.push({node : circlesArray[i].name, dist : "\u221E", prev : ""});
			}
		}
		return tableData;
	}else{
		var length = tableData.length;
		for(let i = length - circlesArray.length; i < length; i++){
			if((tableData[i]).node == tableChangedRowData[0]){
				tableData.push({node: tableChangedRowData[0], dist: tableChangedRowData[1], prev: tableChangedRowData[2]});
			}else{
				tableData.push(tableData[i]);
			}
		}
		for(let i = (tableData.length - circlesArray.length); i < tableData.length; i++){
			newTableData.push(tableData[i]);	
		}
		return newTableData;
	}	
}

/**
 * Function for building the table for the Dijkstra Algorithm
 * There will be three columns: Node, Distance From Source Node, Previous Node
 */
function buildDijkstraTable(tableData, canvasADT, ctxADT){
	//Padding around the table
	var widthPadding = canvasADT.width * 0.1;
	var heightPadding = canvasADT.height * 0.1;

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
				ctxADT.font = "bold 10px Arial";
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

