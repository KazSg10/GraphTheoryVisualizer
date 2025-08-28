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

function move(startNode, endNode, frame, speed, ctx) {
	//Difference in x-coordinates of the two circles
	 var xDiff = endNode.x - startNode.x;
	//Difference in y-coordinates of the two circles
	var yDiff = endNode.y - startNode.y;
	
	var newX = (xDiff * (frame/speed) + startNode.x);
	var newY = (yDiff * (frame/speed) + startNode.y);
	
	ctx.beginPath();
	ctx.moveTo(startNode.x, startNode.y);
	ctx.lineTo(newX, newY);	
	ctx.strokeStyle="red";
	ctx.lineWidth=4;
	ctx.stroke();	
}

//Method for animating a line being drawn between two circles as that line is being visited along
function traverseAlongLine(startNode, endNode, frame, speed, ctx){
	move(startNode, endNode, frame, speed, ctx);
	if(frame < speed){
		frame++;
		requestAnimationFrame(traverseAlongLine(startNode, endNode, frame, speed, ctx));
	}
}

function getStepsList(jsonBody){
	return jsonBody.StepsList;
}

function animate(algorithm, circlesArray) {
	//Getting body from the local storage of the window
    var body = localStorage.getItem("body");
    //Parsing body to json
    var jsonBody = readJsonBody(body);
    var stepsList = jsonBody.StepsList;

    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    const ctx = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');

	var startNode;
	var endNode;
	for(let i = 0; i < Object.keys(stepsList).length; i++){
		
		var visitedNodeName = stepsList[i].VisitedNodeName;
		var pseudoCodeLine = stepsList[i].PseudoCodeLine;
		if(stepsList[i].StackEntry != null){
			var stackEntryValue = stepsList[i].StackEntry.Value;
			var stackEntryAction = stepsList[i].StackEntry.Action;
		}
		

		if(visitedNodeName != null){
			if(startNode != null){
				endNode = getCircle(visitedNodeName, circlesArray);
			}
			else{
				startNode = getCircle(visitedNodeName, circlesArray);
			}
			if((startNode != null) && (endNode != null)){
				window.requestAnimationFrame(traverseAlongLine(startNode, endNode, 1, 10000, ctx));
				startNode = endNode;
				endNode = null;
			}
		}
		
	}
}




//Animating the whole algorithm
//traverseAlongLine
