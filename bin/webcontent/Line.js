//Class for creating a line between two nodes
class Line {
	/**
	 * Constructor for creating a line object between start node and end node
	 * @param {*} x1 - x-coordinate of start node
	 * @param {*} y1 - y-coordinate of start node
	 * @param {*} x2 - x-coordinate of end node
	 * @param {*} y2 - y-coordinate of end node
	 */
	constructor(ctx, x1, y1, x2, y2){
    this.ctx = ctx;    
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;

	}
	/**
	 * Procedure to draw a line between two points
	 * @param {*} color - Colour of the line
	 */
	drawLine(colour){
        console.log("Drawing line: ")
		//Method for starting a new path for the line
		this.ctx.beginPath();
		//Method instructing the line to start from coordinates (x1,y1)
		this.ctx.moveTo(this.x1, this.y1);
		//Method instructing the line to end at coordinates (x2,y2)
		this.ctx.lineTo(this.x2, this.y2);

		//The colour of the line is set to the colour given by the colour parameter
		this.ctx.strokeStyle=colour;
		//The number of pixels of the line's width is set to 10
		this.ctx.lineWidth=10;
		//Method instructing the line to be drawn
		this.ctx.stroke();
	}
}