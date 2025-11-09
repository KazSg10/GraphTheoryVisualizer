//Initialising the canvases and variables required for the simulation of the algorithm
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
	var radius = 35;
    const circlesArray = createCircles(JSON.parse(localStorage.getItem('nodesList')), radius, ctxGraph );
    for(let i = 0; i < circlesArray.length; i++){
	    circlesArray[i].drawCircle("yellow");
    }

	//Creating the edges between the circles
    const edges =  initialiseEdges(circlesArray, ctxGraph , algorithm);
    for(let i = 0; i < edges.length; i++){
	    edges[i].drawLine("orange", radius);
    }

	//Writing the pseucode in the canvasPseudocode at the start, index is -1 since no line is being highlighted
    writePseudocode(JSON.parse(localStorage.getItem('pseudocode')), ctxPseudocode, canvasPseudocode, -1);
	if(algorithm == "DFS"){
		drawDFSCanvas(ctxADT, canvasADT, [], []);
	}
	else if(algorithm == "BFS"){
		drawBFSCanvas(ctxADT, canvasADT, [], []);
	}
	else if(algorithm == "Dijkstra"){
		initialiseDijkstraTable(ctxADT, canvasADT, circlesArray);
	}

	return circlesArray;
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

//Initialising edges between the circles
function initialiseEdges(circlesArray, ctxGraph , algorithm){
	var nodeConnections = JSON.parse(localStorage.getItem('nodeConnections'));
	var keys = Object.keys(nodeConnections);
	//Initialising a list for the edges 
	var edges = [];
	var length = keys.length;
	for(let i = 0; i<length; i++){
		//Retreiving the key in the node connections
		var key = keys[i];
		//Retreiving that key node's neighbours
		var neighboursList = nodeConnections[key];
		//Getting the circle representing the key
		var keyNode = getCircle(key, circlesArray);
		for (let j = 0; j < neighboursList.length; j++) {
			//Getting the circle which is in the edge
			var neighbourNode = getCircle(neighboursList[j].name, circlesArray);
			if(algorithm == "Dijkstra"){
				/**
				 * In the json from the server, the weight of the edge between the key node
				 * and neighbouring node is given in the edgeList section, so I am retreiving
				 * the weight from there
				 */
				edgeList = JSON.parse(localStorage.getItem('edgeList'));
				for(let edgeIndex = 0; edgeIndex < edgeList.length; edgeIndex++){
					if(keyNode.name == edgeList[edgeIndex].node1.name && neighbourNode.name == edgeList[edgeIndex].node2.name){
						var weight = edgeList[edgeIndex].weight;
						break;
					}			
				}
				//DFS and BFS graph edges have no weight
			}else{
				//since there is no weight, I am saying the value for that parameter is -1
				var weight = -1;
			}
		edges.push(new Line(ctxGraph , keyNode.x, keyNode.y, neighbourNode.x, neighbourNode.y, weight));			
		}
	} 
	localStorage.setItem('edges', JSON.stringify(edges));
	return edges;
}

//Function for retrieving the circle, respresenting a specific node, from circlesArray 
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

/**
 * 
 * @param {*} min - The minimum value returned by the random number generator
 * @param {*} max - The maximum value returned by the random number generator
 * @param {*} radius - The radius of the circle required
 * @returns 
 */

//Getting random coordinates for circles in the graph
function getRandomCoordinates(min, max, radius) {
  return Math.random() * (max - (min + radius + 1)) + min;
}

//Validating the coordinates of the centre to see if the nodes are suitably apart
function centreCoordinatesValidator(xCent, yCent, radius, circles){
	for(var circle of circles){
		var pythag = distance(xCent, circle.x, yCent, circle.y);
		var minimumPixelDistance = 100;
		//Making sure each circle is at least minimumPixelDistance distance from each of the circles
		if(pythag < minimumPixelDistance){
			return false;
		}
	}
	return true;
}

//Getting distance between two coordinates
function distance(x1, x2, y1, y2){
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

/**
 * Following two function are used to redraw the canvasADT for DFS and BFS
*/
function drawDFSCanvas(ctxADT, canvasADT, stack, visited){
	//Clearing the canvas before remaking the queue
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	numberOfNodes = JSON.parse(localStorage.getItem('numberOfNodes'));

	//Drawing tack and visited in the canvasADT
	drawDFSStack(ctxADT, canvasADT, numberOfNodes, stack);
	drawDFSVisited(ctxADT, canvasADT, numberOfNodes, visited);
}

function drawBFSCanvas(ctxADT, canvasADT, queue, visited){
	//Clearing the canvas before remaking the queue
	ctxADT.clearRect(0, 0, canvasADT.width, canvasADT.height);

	numberOfNodes = JSON.parse(localStorage.getItem('numberOfNodes'));

	//Drawing queue and visited in the canvasADT
	drawBFSQueue(ctxADT, canvasADT, numberOfNodes, queue);
	drawBFSVisited(ctxADT, canvasADT, numberOfNodes, visited);
}

//Drawing queue for BFS
function drawBFSQueue(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Queue
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var queueWidth = width * 0.3;
	var queueHeight = height * 0.9;

	var cellWidth = queueWidth;
	//The first row is the header row, therefore I am doing numberOfNode + 1 to have an extra row
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.1
	var startY = height*0.05;
	var y;

	var text;

	for(let rowIndex = 0; rowIndex < numberOfNodes + 1; rowIndex++){
		//Drawing a rectangle for each cell in the queue, with the value of the cell in the center
		y = startY + rowIndex * cellHeight;
		ctxADT.strokeRect(x, y, cellWidth, cellHeight);
		if(rowIndex == 0){
			ctxADT.textAlign = "center";
			ctxADT.lineWidth = 2;
			text = "Queue";
			ctxADT.fillStyle = "brown";
			ctxADT.font = "bold 15px Arial";
		}
		else{
			/**
			 * If there is a value in nodes[rowIndex - 1], then that value will be copied into text, otherwise
			 * the text will be blank
			 */
			text = nodes[rowIndex - 1] ? nodes[rowIndex - 1] :  "";
		}
		ctxADT.textBaseline = "middle";
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

//Drawing visited for BFS
function drawBFSVisited(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Visited list
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var queueWidth = width * 0.3;
	var queueHeight = height * 0.9;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.6;
	var startY = height*0.05;
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
			ctxADT.font = "bold 15px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
		}
		ctxADT.textBaseline = "middle";
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

//Drawing stack for DFS

function drawDFSStack(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Stack
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;

	var stackWidth = width * 0.3;
	var stackHeight = height * 0.9;

	var cellWidth = stackWidth;
	var cellHeight = stackHeight/(numberOfNodes+1);

	var x = width*0.1
	var startY = height*0.05;
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
			ctxADT.font = "bold 15px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
			
		}
		ctxADT.textBaseline = "middle";
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

//Drawing queue for DFS
function drawDFSVisited(ctxADT, canvasADT, numberOfNodes, nodes){
	//Draw Visited list
	ctxADT.beginPath();
	width = canvasADT.width;
	height = canvasADT.height;
	var queueWidth = width * 0.3;
	var queueHeight = height * 0.9;

	var cellWidth = queueWidth;
	var cellHeight = queueHeight/(numberOfNodes+1);

	var x = width*0.6;
	var startY = height*0.05;
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
			ctxADT.font = "bold 15px Arial";
		}
		else{
			text = nodes[rowIndex-1] ? nodes[rowIndex-1] :  "";
		}
		ctxADT.textBaseline = "middle";
		ctxADT.fillText(text, x + cellWidth/2, y + cellHeight / 2)
	}
}

//Drawing the Dijkstra Table for Dijkstra
function initialiseDijkstraTable(ctxADT, canvasADT, circlesArray){
	/**
	 * tableChangedRowData parameter is null since the table is not edited yet,
	 * null means draw the initial table
	 */
	buildDijkstraTable(buildTableData(null, circlesArray), canvasADT, ctxADT);
}

//Function for building the data for the Dijkstra table
function buildTableData(tableChangedRowData, circlesArray){
	var newTableData = [];
	if(tableChangedRowData == null){
		for(let i = 0; i < circlesArray.length; i++){
			if(circlesArray[i].name == JSON.parse(localStorage.getItem('sourceNode')).name){
				//If the row is for the source node, then the dist value is 0 since distance from source node to itself is 0
				tableData.push({node : circlesArray[i].name, dist : 0, prev : ""})
			}else{
				//Else the dist value is infinity ("\u221E" is the infinity symbol)
				tableData.push({node : circlesArray[i].name, dist : "\u221E", prev : ""});
			}
		}
		return tableData;
	}else{
		/**
		 * In js arrays/lists, there is no inbuilt function to remove items based off index, therefore, I append the data to
		 * table data everytime, and then I copy the last rows, that are the updated rows, into newTableData
		 */
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
 * Proceudre for building the table for the Dijkstra Algorithm
 * There will be three columns: Node, Distance From Source Node, Previous Node
 */
function buildDijkstraTable(tableData, canvasADT, ctxADT){
	//Padding around the table
	var widthPadding = canvasADT.width * 0.05;
	var heightPadding = canvasADT.height * 0.05;

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
				ctxADT.textBaseline = "middle";
				ctxADT.font = "bold 12.5px Arial";
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
			ctxADT.textBaseline = "middle";
			ctxADT.fillText(text, x + cellWidth / 2, y + cellHeight / 2);
		}	
	}
}

//Queue dequeuing operation
function dequeue(queue){
	var newQueue = [];
	var dequeuedElement = newQueue[0];
	for(let i = 1; i < queue.length; i++){
		newQueue.push(queue[i]);
	}
	return newQueue;
}

