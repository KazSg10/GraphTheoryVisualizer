//Class for creating a line between two nodes
class Line {
	/**
	 * Constructor for creating a line object between start node and end node
	 * @param {*} x1 - x-coordinate of start node
	 * @param {*} y1 - y-coordinate of start node
	 * @param {*} x2 - x-coordinate of end node
	 * @param {*} y2 - y-coordinate of end node
	 */
	constructor(ctxGraph , x1, y1, x2, y2, weight){
		this.ctxGraph  = ctxGraph ;    
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.weight = weight;
	}
	/**
	 * Procedure to draw a line between two points
	 * @param {*} color - Colour of the line
	 */
	drawLine(colour, radius){
		
		const xDiff = this.x2 - this.x1;
		const yDiff = this.y2 - this.y1;

		//Calculating distance between centers
		const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

		/**
		 * Normalizing direction vector  - unitx + unity = moving 1 unit along the distance, since one 
		 * unit vector has a magnitude of 1 unit
		 */
		const unitx = xDiff/distance;
		const unity = yDiff/distance;

		/**
		 * For start circle, we need to move forwards along the path radius units so we start on the circumference
		 * so we start on the circumference for the first circe
		 */
		const newx1 = this.x1 + unitx * radius;
		const newy1 = this.y1 + unity * radius;
		/**
		 * For end circle, we need to move backwards along the path radius units so we end on the circumference
		 * so we start on the circumference for the first circe
		 */
		const newx2 = this.x2 - (unitx * radius);
		const newy2 = this.y2 - (unity * radius);

		//Method for starting a new path for the line
		this.ctxGraph.beginPath();
		//Method instructing the line to start from coordinates (newx1,newy1)
		this.ctxGraph.moveTo(newx1, newy1);
		//Method instructing the line to end at coordinates (newx2,newy2)
		this.ctxGraph.lineTo(newx2, newy2);
		//The colour of the line is set to the colour given by the colour parameter
		this.ctxGraph.strokeStyle = colour;
		//The number of pixels of the line's width is set to 5
		this.ctxGraph.lineWidth = 5;
		//Method instructing the line to be drawn
		this.ctxGraph.stroke();

		//Weight -1 means that there is no weight
		if(this.weight != -1){
			const xWeightCent = (this.x1 + this.x2)/2;
			const yWeightCent = (this.y1 + this.y2)/2;

			this.ctxGraph.font = "16px Arial";
			this.ctxGraph.fillText(this.weight, xWeightCent, yWeightCent);
		}
	}
}