const pseudocode = JSON.parse(localStorage.getItem('body')).Pseudocode;
const simulationSteps = JSON.parse(localStorage.getItem('body')).simulationSteps;
const algorithm = JSON.parse(localStorage.getItem('body')).Algorithm;

var framePath = 1;
//Increasing the speed value, actually makes the simulation slower
var speed =10;
var framePseudocode = 1;
var speedPseudocode = 500;
var fromCircle;
var toCircle;
var stepsIndex = 0;
var ctxGraph;
var ctxPseudocode;
var ctxADT;
var colour;
var startCirclesNamesList = [];
var endCircleNamesList = [];
var canvasGraph;
var canvasADT;
var canvasPseudocode;
var start = null;
var pseudocodeLine;
var nullInteger = (Math.pow(2, 31) - 1);
const visited = [];
var pseudocodeUpdated = false;
var stackEntryValue;
var stackEntryAction;
const stack = [];
var stackUpdated = false;
var stackIndex = 0;
var queue = [];
var distance;
var tableData = []
var fromCircleColour;
var toCircleColour;


var animationInProgress = false;

//The function that will trigger the animation
function simulate() {
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
	
	//Starting the animation process
	processSteps();
}

//Function for rewriting the pseudocode with the current line being highlighted
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
		ctxPseudocode.fillText(pseudocode[i], 0, ((i+1)/length)*canvas.height - (0.35/length)*canvas.height, canvas.width);
	}
}

//Function for drawing line 
function animateEdge() {
	//If there is no fromCircle or toCircle, then there is no edge to be drawn along, leading to processSteps being called again
	
	if (fromCircle == null || toCircle == null) {
		processSteps();
	}else{
		if(startCirclesNamesList.includes(toCircle.name) && endCircleNamesList.includes(fromCircle.name)){
			colour = "cyan";
		}else{
			colour = "red";
		}
		if(framePath == 1){
			fromCircleColour = fromCircle.fillColour;
			toCircleColour = toCircle.fillColour;
		}
		//Difference in x-coordinates of the two circles
		var xDiff = toCircle.x - fromCircle.x;
		//Difference in y-coordinates of the two circles
		var yDiff = toCircle.y - fromCircle.y;
		
		var newX = (xDiff * (framePath /speed) + fromCircle.x);
		var newY = (yDiff * (framePath/speed) + fromCircle.y);
		
		ctxGraph.beginPath();
		ctxGraph.moveTo(fromCircle.x, fromCircle.y);
		ctxGraph.lineTo(newX, newY);	

		ctxGraph.strokeStyle=colour;
		ctxGraph.lineWidth=4;
		ctxGraph.stroke();	

		if(framePath < speed){
			framePath++;
			requestAnimationFrame(animateEdge);
		} else {
			
			if(!startCirclesNamesList.includes(fromCircle.name)) {
				startCirclesNamesList.push(fromCircle.name);
			} 
			if(!endCircleNamesList.includes(toCircle.name)){
				endCircleNamesList.push(toCircle.name);
			}
			fromCircle.drawCircle(fromCircleColour);
			toCircle.drawCircle(toCircleColour);

			var line = retrieveLine(fromCircle, toCircle);
			line.drawLine(colour, fromCircle.radius);

			fromCircle = null;
			toCircle = null;
			framePath = 1;
			processSteps();
		}
	}
}

function retrieveLine(circle1, circle2){
		for(var line of JSON.parse(localStorage.getItem('edges'))){
			if((line.x1 == circle1.x && line.x2 == circle2.x && line.y1 == circle1.y && line.y2 == circle2.y)||(line.x1 == circle2.x && line.x2 == circle1.x && line.y1 == circle2.y && line.y2 == circle1.y)){
				return new Line(ctxGraph, line.x1, line.y1, line.x2, line.y2, line.weight);
			}
		}
	}

//Function for updating the highlighting of the pseudocode lines
function updatePseudocode() {
	//Highlighting the current line
	writePseudocode(pseudocode, ctxPseudocode, canvasPseudocode, simulationSteps[stepsIndex].PseudocodeLineIndex);

	/**
	 * While the framePath is less than speed, this function will be repeated until framePath is equal to 50
	 * Changing the framePath changes the speed
	 */
	if(framePath <= speed){
		framePath++;
		requestAnimationFrame(updatePseudocode)	
	} else {
		//After framePath equals speed, the framePath is reset to 1 
		framePath = 1;
		//When the values are reset, the animateEdge function is called
		animateEdge()
	}
	
}
 
// function updateADT(algorithm){
// 	switch(algorithm){
// 		case "DFS":
// 			drawDFSCanvas(ctxADT, canvasADT, stack, visited);
// 			break;
// 		case "BFS":
// 			drawBFSCanvas(ctxADT, canvasADT, queue, visited);
// 			break;
// 		case "Dijkstra":
// 			updateDijkstraADT(algorithm);
// 			break;	
// 	}
// 	processSteps();
// }

function processSteps() {
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

	//Retrieving PseudocodeLine from the simulationSteps in json
	pseudocodeLine = pseudocode[simulationSteps[stepsIndex].PseudocodeLineIndex];
	
	var visitedNode = simulationSteps[stepsIndex].VisitedNodeName;
	var traversedNode = simulationSteps[stepsIndex].TraversedNodeName;

	switch(algorithm){
		case "DFS":
			if(simulationSteps[stepsIndex].StackEntry != null){
				//Retrieving StackEntry.Value and StackEntry.Action from the simulationSteps in json
				stackEntryValue = simulationSteps[stepsIndex].StackEntry.Value;
				stackEntryAction = simulationSteps[stepsIndex].StackEntry.Action;
				if(stackEntryAction == "PUSH"){
					stack.push(stackEntryValue);
				}
				else if(stackEntryAction == "POP"){
					stack.pop();
				}
			}
			if(simulationSteps[stepsIndex].VisitedNodeName != null){
				visited.push(visitedNode);
				getCircle(visitedNode, circlesArray).drawCircle("blue");
			}
			drawDFSCanvas(ctxADT, canvasADT, stack, visited)
			break;

		case "BFS":
			if(simulationSteps[stepsIndex].QueueEntry != null){
				queueEntryValue = simulationSteps[stepsIndex].QueueEntry.Value;
				queueEntryAction = simulationSteps[stepsIndex].QueueEntry.Action;
				if(queueEntryAction == "ENQUEUE"){
					queue.push(queueEntryValue);
				}
				else if(queueEntryAction == "DEQUEUE"){
					queue.pop();
				}
			}
			if(simulationSteps[stepsIndex].VisitedNodeName != null){
				visited.push(visitedNode);
				getCircle(visitedNode, circlesArray).drawCircle("blue");
			}
		
			drawBFSCanvas(ctxADT, canvasADT, queue, visited);
			break;			
		case "Dijkstra":
			if(simulationSteps[stepsIndex].NewDistance != nullInteger){
				var tableData = buildTableData([simulationSteps[stepsIndex].VisitedNodeName, simulationSteps[stepsIndex].NewDistance, simulationSteps[stepsIndex].NewPreviousNode], circlesArray);
				buildDijkstraTable(tableData, canvasADT, ctxADT);

			}
			if(simulationSteps[stepsIndex].TraversedNodeName != null){
				getCircle(traversedNode, circlesArray).drawCircle("blue");
			}	
			break;				
	}
	
	

	//Start Animation
	updatePseudocode();
	stepsIndex++;
}


function sleep(milliseconds){
	var currentTime = new Date().getTime();
	while(currentTime + milliseconds >= new Date().getTime()){}
}
