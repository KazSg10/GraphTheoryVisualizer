const pseudocode = JSON.parse(localStorage.getItem('body')).Pseudocode;
const simulationSteps = JSON.parse(localStorage.getItem('body')).simulationSteps;
const algorithm = JSON.parse(localStorage.getItem('body')).Algorithm;

//Setting up variables required for the functions for the simulation 
var framePath = 1;
//Increasing the inverseSpeed value, makes the simulation slower
var inverseSpeed;
var fromCircle;
var toCircle;
var stepsIndex = 0;
var ctxGraph;
var ctxPseudocode;
var ctxADT;
var lineColour;
var startCirclesNamesList = [];
var endCircleNamesList = [];
var canvasGraph;
var canvasADT;
var canvasPseudocode;
var start = null;
var nullInteger = (Math.pow(2, 31) - 1);
const visited = [];
var pseudocodeUpdated = false;
const stack = [];
var queue = [];
var tableData = []
var fromCircleColour;
var toCircleColour;

//The procedure that will trigger the animation
function simulate() {
	//Initialising the inverseSpeedValue based on the value of the speedRange slider 
	inverseSpeed = 60 - document.getElementById("speedRange").value;
    //Getting canvas elements from DOM (Document Object Model)
    canvasGraph = document.getElementById('canvasGraph');
    canvasADT = document.getElementById('canvasADT');
    canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    ctxGraph = canvasGraph.getContext('2d'); 
    ctxADT = canvasADT.getContext('2d');
    ctxPseudocode = canvasPseudocode.getContext('2d');
	
	//Disabling the play button for the duration of the animation
	document.getElementById("Play").disabled = true;
	document.getElementById("speedRange").disabled = true;
	//Starting the animation process
	processSteps();
}

//Procedure for processing the simulation steps which has come from the server
function processSteps() {
	//if stepsIndex is less than the number of simulation steps, then the simulation should stop
	if(stepsIndex >= Object.keys(simulationSteps).length){
		return;
	}

	//Retrieving FromNode and ToNode from the simulationSteps in json
	var fromNode = simulationSteps[stepsIndex].FromNode;
	var toNode = simulationSteps[stepsIndex].ToNode;
	if(fromNode != null && toNode != null){
		fromCircle = getCircle(fromNode, circlesArray);
		toCircle = getCircle(toNode, circlesArray);
	}
	
	var visitedNode = simulationSteps[stepsIndex].VisitedNodeName;
	var traversedNode = simulationSteps[stepsIndex].TraversedNodeName;

	switch(algorithm){
		case "DFS":
			if(simulationSteps[stepsIndex].StackEntry != null){
				//Retrieving StackEntry.Value and StackEntry.Action from the simulationSteps in json and performing different actions based on the action
				var stackEntryValue = simulationSteps[stepsIndex].StackEntry.Value;
				var stackEntryAction = simulationSteps[stepsIndex].StackEntry.Action;
				if(stackEntryAction == "PUSH"){
					stack.push(stackEntryValue);
				}
				else if(stackEntryAction == "POP"){
					stack.pop();
				}
			}
			if(simulationSteps[stepsIndex].VisitedNodeName != null){
				visited.push(visitedNode);
				//If a node is visited, then the circle representing that node is filled with the colour blue
				getCircle(visitedNode, circlesArray).drawCircle("blue");
			}
			//Redrawing the DFS canvas
			drawDFSCanvas(ctxADT, canvasADT, stack, visited)
			break;

		case "BFS":
			if(simulationSteps[stepsIndex].QueueEntry != null){
				//Retrieving QueueEntry.Value and QueueEntry.Action from the simulationSteps in json and performing different actions based on the action
				var queueEntryValue = simulationSteps[stepsIndex].QueueEntry.Value;
				var queueEntryAction = simulationSteps[stepsIndex].QueueEntry.Action;
				if(queueEntryAction == "ENQUEUE"){
					queue.push(queueEntryValue);
				}
				else if(queueEntryAction == "DEQUEUE"){
					queue = dequeue(queue);
					
				}
			}
			if(simulationSteps[stepsIndex].VisitedNodeName != null){
				visited.push(visitedNode);
				//If a node is visited, then the circle representing that node is filled with the colour blue
				getCircle(visitedNode, circlesArray).drawCircle("blue");
			}
			//Redrawing the BFS canvas
			drawBFSCanvas(ctxADT, canvasADT, queue, visited);
			break;	

		case "Dijkstra":
			//If the new distance has changed, then the Dijktra Table is updated
			if(simulationSteps[stepsIndex].NewDistance != nullInteger){
				var tableData = buildTableData([simulationSteps[stepsIndex].VisitedNodeName, simulationSteps[stepsIndex].NewDistance, simulationSteps[stepsIndex].NewPreviousNode], circlesArray);
				buildDijkstraTable(tableData, canvasADT, ctxADT);

			}
			//If all the paths between a node and its neighbours, then the circle representing the circle is filled with the colour blue
			if(simulationSteps[stepsIndex].TraversedNodeName != null){
				getCircle(traversedNode, circlesArray).drawCircle("blue");
			}	
			break;				
	}

	//The next step is to update the pseudocode and update the stepsIndex to go to the next step;
	updatePseudocode();
	stepsIndex++;
}

//Procedure for updating the highlighting of the pseudocode lines
function updatePseudocode() {
	//Highlighting the current line
	writePseudocode(pseudocode, ctxPseudocode, canvasPseudocode, simulationSteps[stepsIndex].PseudocodeLineIndex);

	/**
	 * While the framePath is less than inverseSpeed, this function will be repeated until framePath is equal to inverseSpeed
	 * The greater the inverseSpeed, the slower the time it takes to go through the pseudocode
	 */
	if(framePath <= inverseSpeed){
		framePath++;
		requestAnimationFrame(updatePseudocode)	
	} else {
		//After framePath equals inverseSpeed, the framePath is reset to 1 
		framePath = 1;
		//When the values are reset, the next step is animateEdge function
		animateEdge()
	}	
}

//Procedure for rewriting the pseudocode with the current line being highlighted
function writePseudocode(pseudocode, ctxPseudocode, canvas, PseudocodeLineIndex){

	//Clearing the pseudocode before writing pseudocode
	ctxPseudocode.clearRect(0, 0, canvasPseudocode.width, canvasPseudocode.height);
	//Getting length of the pseudocode array in the json
	var length = Object.keys(pseudocode).length;
	//var lineHeight = canvas.height/length;
	ctxPseudocode.font = "10px Arial";
	
	for(let i = 0; i < length; i++){
		//Highlight current line in canvasPseudocode told by PseudocodeLineIndex
		if(i == PseudocodeLineIndex){
			ctxPseudocode.fillStyle = "#ff2f00ff";
		}
		else{
			ctxPseudocode.fillStyle = "#000000";
		}
		//Writing the pseudocode with updated highlighted line
		ctxPseudocode.textBaseline = "middle";
		ctxPseudocode.fillText(pseudocode[i], 0, ((i+1)/length)*canvas.height - (0.35/length)*canvas.height, canvas.width);
	}
}

//Procedure for drawing line 
function animateEdge() {
	//If there is no fromCircle or toCircle, then there is no edge to be drawn along, leading to processSteps being called again
	if (fromCircle == null || toCircle == null) {
		processSteps();
	}else{
		/**
		 * If the edge has been traversed already but in the other way, the colour of the part of the traversal in the other way 
		 * will be cyan, otherwise it is red
		 */
		if(startCirclesNamesList.includes(toCircle.name) && endCircleNamesList.includes(fromCircle.name)){
			lineColour = "cyan";
		}else{
			lineColour = "red";
		}
		/**
		 * Saving the fromCircle and toCircle fill colours at the start so that after the full traversal, the circles are drawn again with the same 
		 * fill colour so that the path of the traversal that goes in the circles are overriden so it looks like the traversal goes from
		 * edge to edge, making it look more professional
		 */
		if(framePath == 1){
			fromCircleColour = fromCircle.fillColour;
			toCircleColour = toCircle.fillColour;
		}
		//Difference in x-coordinates of the two circles
		var xDiff = toCircle.x - fromCircle.x;
		//Difference in y-coordinates of the two circles
		var yDiff = toCircle.y - fromCircle.y;
		
		//Setting up coordinates of the points in the path between the two circles based on the inverseSpeed
		var newX = (xDiff * (framePath /inverseSpeed) + fromCircle.x);
		var newY = (yDiff * (framePath/inverseSpeed) + fromCircle.y);
		
		//Drawing the path from the starting circle to the point in the path 
		ctxGraph.beginPath();
		ctxGraph.moveTo(fromCircle.x, fromCircle.y);
		ctxGraph.lineTo(newX, newY);	

		ctxGraph.strokeStyle=lineColour;
		ctxGraph.lineWidth=4;
		ctxGraph.stroke();	

		if(framePath < inverseSpeed){
			framePath++;
			/**
			 * requestAnimationFrame is used to loop animateEdge again. requestAnimationFrame instructs the system
			 * to prepare for an animation leading to a more clean animation
			 */
			requestAnimationFrame(animateEdge);
		} else {
			//Adding the fromCircle and toCircle to the startCirclesNamesList and endCirclesNameList
			if(!startCirclesNamesList.includes(fromCircle.name)) {
				startCirclesNamesList.push(fromCircle.name);
			} 
			if(!endCircleNamesList.includes(toCircle.name)){
				endCircleNamesList.push(toCircle.name);
			}
			fromCircle.drawCircle(fromCircleColour);
			toCircle.drawCircle(toCircleColour);
			/**
			 * This process is for the Dijkstra's Algorithms, I am redrawing the line with the same line colour so that
			 * the number of the weight comes on the top and is not overriden by the line colour
			 */
			var line = retrieveLine(fromCircle, toCircle);
			line.drawLine(lineColour, fromCircle.radius);

			fromCircle = null;
			toCircle = null;
			framePath = 1;
			processSteps();
		}
	}
}

//Function for retrieving the line between the two circles
function retrieveLine(circle1, circle2){
		for(var line of JSON.parse(localStorage.getItem('edges'))){
			if((line.x1 == circle1.x && line.x2 == circle2.x && line.y1 == circle1.y && line.y2 == circle2.y)||(line.x1 == circle2.x && line.x2 == circle1.x && line.y1 == circle2.y && line.y2 == circle1.y)){
				return new Line(ctxGraph, line.x1, line.y1, line.x2, line.y2, line.weight);
			}
		}
}


