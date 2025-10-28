//Defining an Array of lists containing key-value pairs of two circles which are at the two ends of a line
// var circleCoordinates = [];
// //Method for adding the values to the circleCoordinates array
// circleCoordinates.push(
// 	{startNode: c1, endNode: c2},
// 	{startNode: c2, endNode: c3}
// );

// //Variable which is iterated over in the drawAnimatedPath procedure
// var frame = 0;
// //Difference in x-coordinates of the two circles
// var xDiff = c2.x - c1.x;
// //Difference in y-coordinates of the two circles
// var yDiff = c2.y - c1.y;
// var speed = 100;

var framePath = 1;
var speedPath = 100;
var framePseudocode = 1;
var speedPseudocode = 500;
var circlesArray1;
var simulationSteps;
var fromCircle;
var toCircle;
var stepsIndex = 0;
var ctx;
var ctxPseudocode;
var ctxADT;
var colour = "red";
var startCirclesNamesList = [];
var canvasGraph;
var canvasADT;
var canvasPseudocode;
var jsonBody;
var start = null;
var pseudocodeLine;
var stackEntryValue;
var stackEntryAction;
const stack = [];
const queue = [];
const visitedNodesList = [];

var pseudoCodeUpdated = false;
var stackUpdated = false;
var stackIndex = 0;


var animationInProgress = false;

function writePseudocode(pseudocode, ctx, canvas, index){
	//Highlight text in canvasPseudocode
	//ctx.strokeText("Karan", canvas.width*0.1, canvas.height*0.1);
	var length = Object.keys(pseudocode).length;
	//var lineHeight = canvas.height/length;
	ctx.font = "25px Arial";
	
	
	for(let i = 0; i < length; i++){
		if(i == index){
			ctx.fillStyle = "#ff2f00ff";
		}
		else{
			ctx.fillStyle = "#000000";
		}
		ctx.fillText(pseudocode[i], 0, ((i+1)/length)*canvas.height - (0.35/length)*canvas.height, canvas.width);
	}
}

function animateEdge() {
	if (fromCircle == null || toCircle == null) {
		requestAnimationFrame(updateStack)
		return;
	}

	if(startCirclesNamesList.includes(toCircle.name)){
	 colour = "yellow";
	} else {
	  colour = "red";
	}

	//Difference in x-coordinates of the two circles
	 var xDiff = toCircle.x - fromCircle.x;
	//Difference in y-coordinates of the two circles
	var yDiff = toCircle.y - fromCircle.y;
	
	var newX = (xDiff * (framePath/speedPath) + fromCircle.x);
	var newY = (yDiff * (framePath/speedPath) + fromCircle.y);
	
	ctx.beginPath();
	ctx.moveTo(fromCircle.x, fromCircle.y);
	ctx.lineTo(newX, newY);	

	ctx.strokeStyle=colour;
	ctx.lineWidth=4;
	ctx.stroke();	

	if(framePath < speedPath){
		requestAnimationFrame(animateEdge)
		framePath++;
	} else {
		requestAnimationFrame(updateStack)
		if(!startCirclesNamesList.includes(fromCircle.name)) {
		 	startCirclesNamesList.push(fromCircle.name);
		} 
		fromCircle = null;
		toCircle = null;
		framePath = 1;
	}
	

}

//Function for updating the highlighting of the pseudocode
function updatePseudocode() {
	if (!pseudoCodeUpdated) {
		var pseudocodeArrayIndex = getPseudocodeIndex(pseudocodeLine);
		writePseudocode(jsonBody.Pseudocode, ctxPseudocode, canvasPseudocode, pseudocodeArrayIndex);
		pseudoCodeUpdated = true;
	}

	if(framePath <= 50){
		requestAnimationFrame(updatePseudocode)
		framePath++;
	} else {
		requestAnimationFrame(animateEdge)
		framePath = 1;
		pseudoCodeUpdated = false;
	}
	
}

function updateStack(){
	if (stackEntryValue == null || stackEntryAction == null) {
		requestAnimationFrame(processSteps)
		return;
	}
	ctxADT.font = "30px Arial";
	ctxADT.fillStyle = "#ff2f00ff";
	
	//Adding to the stack a value and also a pointer to the left of it
	reDrawStack();
	requestAnimationFrame(processSteps);
	stackEntryValue = null;
	stackEntryAction = null;
	
}

function reDrawStack(){
		initialiseStack(ctxADT, canvasADT)
		if(stackEntryAction == "PUSH"){
			stack.push(stackEntryValue)
		}
		else if(stackEntryAction == "POP"){
			stack.pop();
		}
		for(let i = 0; i < stack.length; i++){
			
			if(i == stack.length-1){
				ctxADT.fillText("---->", canvasADT.width*0.78, canvasADT.height - (i + 1)*canvasADT.height*9/100, canvasADT.width);
				ctxADT.fillText(stack[i], canvasADT.width*0.9, canvasADT.height - (i + 1)*canvasADT.height*9/100, canvasADT.width);

			}
			else{
				ctxADT.fillText(stack[i], canvasADT.width*0.9, canvasADT.height - (i + 1)*canvasADT.height*9/100, canvasADT.width);
				//ctxADT.fillText(stack[i], canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.6*i, canvasADT.height*0.23);
			}
		} 
		stackIndex = 0;
	}
	

function updateQueue(){

}

function updateDijkstraTable(){

}

function processSteps() {
	if(stepsIndex >= Object.keys(simulationSteps).length){
		return;
	}

	//Retrieving PseudoCodeLine from the simulationSteps in json
	pseudocodeLine = simulationSteps[stepsIndex].PseudoCodeLine;

	//Retrieving visited node informations
	var visitedNode = simulationSteps[stepsIndex].VisitedNodeName;
	if(visitedNode != null){
		visitedNodesList.push(visitedNode);
	}

	
	//Retrieving FromNode and ToNode from the simulationSteps in json
	var fromNode = simulationSteps[stepsIndex].FromNode;
	var toNode = simulationSteps[stepsIndex].ToNode;
	if(fromNode != null && toNode != null){
		fromCircle = getCircle(fromNode, circlesArray1);
		toCircle = getCircle(toNode, circlesArray1);
	}
	
	if(simulationSteps[stepsIndex].StackEntry != null){
		//Retrieving StackEntry.Value and StackEntry.Action from the simulationSteps in json
	 	stackEntryValue = simulationSteps[stepsIndex].StackEntry.Value;
	 	stackEntryAction = simulationSteps[stepsIndex].StackEntry.Action;
	}

	//Start Animation
	requestAnimationFrame(updatePseudocode);
	stepsIndex++;
}

function getsimulationSteps(jsonBody){
	return jsonBody.SimulationSteps;
}



function animate(algorithm, circlesArray) {
	circlesArray1 = circlesArray;

	//Getting body from the local storage of the window
    var body = localStorage.getItem("body");
	console.log(body);
    //Parsing body to json
    jsonBody = readJsonBody(body);
    simulationSteps = jsonBody.simulationSteps;

    //Getting canvas elements from DOM (Document Object Model)
    canvasGraph = document.getElementById('canvasGraph');
    canvasADT = document.getElementById('canvasADT');
    canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    ctx = canvasGraph.getContext('2d'); 
    ctxADT = canvasADT.getContext('2d');
    ctxPseudocode = canvasPseudocode.getContext('2d');
	requestAnimationFrame(processSteps);
	
	document.getElementById("Play").disabled = true;
}



function getPseudocodeIndex(pseudocodeLine){
	var pseudocodeArray = jsonBody.Pseudocode;
	var length = Object.keys(pseudocodeArray).length;
	
	for(let i = 0; i < length; i++){
		if(pseudocodeArray[i].includes(pseudocodeLine)){
			return i;
		}		
	}
}

function sleep(milliseconds){
	var currentTime = new Date().getTime();
	while(currentTime + milliseconds >= new Date().getTime()){}
}






//Animating the whole algorithm
//traverseAlongLine
