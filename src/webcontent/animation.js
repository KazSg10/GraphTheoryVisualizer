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
var speedPath = 500;
var framePseudocode = 1;
var speedPseudocode = 500;
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
var start = null;
var pseudocodeLine;
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

function updatePseudocode(pseudocodeLine) {
	var pseudocodeArrayIndex = getPseudocodeIndex(pseudocodeLine);
	writePseudocode(jsonBody.Pseudocode, ctxPseudocode, canvasPseudocode, pseudocodeArrayIndex);
}

var firstTimestamp;
var previousTimestamp;
var refreshElapsedTime;
//Method for animating a line being drawn between two circles as that line is being visited along
function traverseAlongLine(currentTime){

	if(previousTimestamp == null){
		previousTimestamp = currentTime;
	}
	else{
		refreshElapsedTime = currentTime - previousTimestamp;
	}


	if (firstTimestamp == null) {
		firstTimestamp = currentTime;
		requestAnimationFrame(traverseAlongLine);

	}
	else{
		var elapsedTime = currentTime - firstTimestamp;
		if (elapsedTime <= 500) {
			requestAnimationFrame(traverseAlongLine);
		}
		else{
			if(stepsIndex >= Object.keys(stepsList).length){
				return;
			}
			var fromNode = stepsList[stepsIndex].FromNode;
			var toNode = stepsList[stepsIndex].ToNode;
			pseudocodeLine = stepsList[stepsIndex].PseudoCodeLine;
			updatePseudocode(pseudocodeLine);

			if(fromNode != null && toNode != null){
				fromCircle = getCircle(fromNode, circlesArray1);

				if(!startCirclesNamesList.includes(fromCircle.name)) {
					startCirclesNamesList.push(fromCircle.name);
				} 

				toCircle = getCircle(toNode, circlesArray1);
				
				if(framePath <= speedPath){
					if(startCirclesNamesList.includes(toNode.name)){
						color = "yellow";
					}
					move(fromCircle, toCircle, framePath, speedPath, ctx, color);
					framePath++;
					requestAnimationFrame(traverseAlongLine);
				} else {
					stepsIndex++;
					requestAnimationFrame(traverseAlongLine);
				}
			}
			else{	
				stepsIndex++;
				requestAnimationFrame(traverseAlongLine);
				firstTimestamp = null;
			}

			
		}
	}
}

function getStepsList(jsonBody){
	return jsonBody.StepsList;
}



function animate(algorithm, circlesArray) {
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
	requestAnimationFrame(traverseAlongLine);
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
