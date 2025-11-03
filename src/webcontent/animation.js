const pseudocode = JSON.parse(localStorage.getItem('pseudocode'));
const simulationSteps = JSON.parse(localStorage.getItem('simulationSteps'));
const algorithm = JSON.parse(localStorage.getItem('algorithm'));

var framePath = 1;
//Increasing the speed value, actually makes the simulation slower
var speed =50;
var framePseudocode = 1;
var speedPseudocode = 500;
var fromCircle;
var toCircle;
var stepsIndex = 0;
var graphCtx;
var ctxPseudocode;
var ctxADT;
var colour;
var startCirclesNamesList = [];
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


var animationInProgress = false;

function simulate() {
    //Getting canvas elements from DOM (Document Object Model)
    canvasGraph = document.getElementById('canvasGraph');
    canvasADT = document.getElementById('canvasADT');
    canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    graphCtx = canvasGraph.getContext('2d'); 
    ctxADT = canvasADT.getContext('2d');
    ctxPseudocode = canvasPseudocode.getContext('2d');	
	document.getElementById("Play").disabled = true;
	processSteps();
}

function writePseudocode(pseudocode, ctxPseudocode, canvas, PseudocodeLineIndex){
	ctxPseudocode.clearRect(0, 0, canvasPseudocode.width, canvasPseudocode.height);
	var length = Object.keys(pseudocode).length;
	//var lineHeight = canvas.height/length;
	ctxPseudocode.font = "10px Arial";
	
	
	for(let i = 0; i < length; i++){
		//Highlight current line in canvasPseudocode
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

function animateEdge() {
	if (fromCircle == null || toCircle == null) {
		processSteps();
	}else{
		if(startCirclesNamesList.includes(toCircle.name)){
			colour = "yellow";
		}else{
			colour = "red";
		}
		//Difference in x-coordinates of the two circles
		var xDiff = toCircle.x - fromCircle.x;
		//Difference in y-coordinates of the two circles
		var yDiff = toCircle.y - fromCircle.y;
		
		var newX = (xDiff * (framePath /speed) + fromCircle.x);
		var newY = (yDiff * (framePath/speed) + fromCircle.y);
		
		graphCtx.beginPath();
		graphCtx.moveTo(fromCircle.x, fromCircle.y);
		graphCtx.lineTo(newX, newY);	

		graphCtx.strokeStyle=colour;
		graphCtx.lineWidth=4;
		graphCtx.stroke();	

		if(framePath < speed){
			framePath++;
			requestAnimationFrame(animateEdge);
		} else {
			
			if(!startCirclesNamesList.includes(fromCircle.name)) {
				startCirclesNamesList.push(fromCircle.name);
			} 
			fromCircle = null;
			toCircle = null;
			framePath = 1;
			processSteps();
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
