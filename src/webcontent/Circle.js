//Class for creating a circle
class Circle{
	/**
	 * Constructor for creating a circle object
	 * @param {*} x - x-coordinate of circle 
	 * @param {*} y - y-coordinate of circle
	 * @param {*} radius - Radius of circle
	 */
	constructor(name, ctx, x, y, radius){
		this.name = name;
		this.ctx = ctx;
		this.x =x;
		this.y = y;
		this.radius = radius;
	}
	//Procedure for drawing a circle
	drawCircle(){
		console.log('Drawing Circle with co-ordinates - ' + 'x:' + this.x);
		//Method for starting a new path for the line
		this.ctx.beginPath();
		//Method to draw the circle according to the x and y coordinates and radius
		this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		//Fill colour of circle is set to grey
		this.ctx.fillStyle="white";
		//Method to colour in the circle
		this.ctx.fill();
		//Naming nodes
		this.ctx.fillStyle = "red";
		this.ctx.textAlign = "center";
		this.ctx.font = "20px Arial"
		this.ctx.fillText(this.name, this.x, this.y);
		//Method instructing the circle to be drawn
		this.ctx.stroke();
	}
}