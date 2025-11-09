/**
 * Class for creating a circle
 */
class Circle{
	/**
	 * Constructor for creating a circle object
	 * @param {*} x - x-coordinate of circle 
	 * @param {*} y - y-coordinate of circle
	 * @param {*} radius - Radius of circle
	 */

	constructor(name, ctxGraph , x, y, radius){
		this.name = name;
		this.ctxGraph  = ctxGraph;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.fillColour = "white";
	}
	/**
	 * Drawing a circle
	 * @param {*} circleFillColour - Fill colour of circle
	 */
	drawCircle(circleFillColour){
		console.log('Drawing Circle with co-ordinates - ' + 'x:' + this.x);
		//Method for starting a new path for the line
		this.ctxGraph.beginPath();
		//Method to draw the circle according to the x and y coordinates and radius
		this.ctxGraph.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		//Fill colour of circle is set to grey
		this.fillColour = circleFillColour;
		this.ctxGraph.fillStyle= circleFillColour;
		//Method to colour in the circle
		this.ctxGraph.fill();
		//Naming nodes
		this.ctxGraph.fillStyle = "red";
		this.ctxGraph.textAlign = "center";
		this.ctxGraph.font = "20px Arial"
		this.ctxGraph.textBaseline = "middle";
		this.ctxGraph.fillText(this.name, this.x, this.y);
		//Method instructing the circle to be drawn
		this.ctxGraph.stroke();
	}
}