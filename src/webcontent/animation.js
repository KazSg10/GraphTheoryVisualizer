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

var frame;
var speed;
var circlesArray1;
var stepsList;
var fromCircle;
var toCircle;
var stepsIndex = 0;
var ctx;
var ctxPseudocode;
var ctxADT;
var color = "red";
var startCirclesNamesList = [];
var canvasGraph;
var canvasADT;
var canvasPseudocode;
var jsonBody;
//(startNode, endNode, 1, 500, ctx)

function move(fromCircle, toCircle, frame, speed, ctx, color) {
	//Difference in x-coordinates of the two circles
	 var xDiff = toCircle.x - fromCircle.x;
	//Difference in y-coordinates of the two circles
	var yDiff = toCircle.y - fromCircle.y;
	
	var newX = (xDiff * (frame/speed) + fromCircle.x);
	var newY = (yDiff * (frame/speed) + fromCircle.y);
	
	ctx.beginPath();
	ctx.moveTo(fromCircle.x, fromCircle.y);
	ctx.lineTo(newX, newY);	
	ctx.strokeStyle=color;
	ctx.lineWidth=4;
	ctx.stroke();	
}

//Method for animating a line being drawn between two circles as that line is being visited along
function traverseAlongLine(){
	move(fromCircle, toCircle, frame, speed, ctx, color);
	
	//Making colour based on if there is backtracking or not
	if(!startCirclesNamesList.includes(toCircle.name)){
		color = "red";
	}
	else{
		color = "yellow";
	}
	if(frame < speed){
		frame++;
		//TODO Check Brackets
		requestAnimationFrame(traverseAlongLine);
	} else {
		processSteps();
		frame = 1;
		requestAnimationFrame(traverseAlongLine);
	}
}

function getStepsList(jsonBody){
	return jsonBody.StepsList;
}



function animate(algorithm, circlesArray) {
	frame = 1;
	speed = 500;
	circlesArray1 = circlesArray;

	//Getting body from the local storage of the window
    var body = localStorage.getItem("body");
	console.log(body);
    //Parsing body to json
    jsonBody = readJsonBody(body);
    stepsList = jsonBody.StepsList;

    //Getting canvas elements from DOM (Document Object Model)
    canvasGraph = document.getElementById('canvasGraph');
    canvasADT = document.getElementById('canvasADT');
    canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    ctx = canvasGraph.getContext('2d'); 
    ctxADT = canvasADT.getContext('2d');
    ctxPseudocode = canvasPseudocode.getContext('2d');
	processSteps();
	window.requestAnimationFrame(traverseAlongLine);
}

function processSteps() {
	for(;stepsIndex < Object.keys(stepsList).length; stepsIndex++){
		var fromNode = stepsList[stepsIndex].FromNode;
		var toNode = stepsList[stepsIndex].ToNode;

		var pseudocodeLine = stepsList[stepsIndex].PseudoCodeLine;
		var pseudocodeIndex = getPseudocodeIndex(pseudocodeLine);
		writePseudocode(jsonBody.Pseudocode, ctxPseudocode, canvasPseudocode, pseudocodeIndex);
		sleep(1000);
		
		// if(stepsList[i].StackEntry != null){
		// 	var stackEntryValue = stepsList[i].StackEntry.Value;
		// 	var stackEntryAction = stepsList[i].StackEntry.Action;
		// }

		if(fromNode != null && toNode != null){
			fromCircle = getCircle(fromNode, circlesArray1);
			startCirclesNamesList.push(fromCircle.name);
			toCircle = getCircle(toNode, circlesArray1);
			//Incrementing index by one to keep track of the first step which will be executed next time
			stepsIndex++;
			return;
		}
	}
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
