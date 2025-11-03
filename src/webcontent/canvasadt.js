window.innerHeight *= 0.85;
var canvas = createCanvas('canvasadt', window.innerWidth, window.innerHeight);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var resize = () =>{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);


var ctxGraph  = canvas.getContext('2d');
ctxGraph .fillStyle="red";
ctxGraph .fillRect(window.innerWidth/2,0, canvas.width, canvas.height);

