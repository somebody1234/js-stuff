//TODO: does getOwnPropertyNames exist in ES5?

'use strict';

Object.getOwnPropertyNames(Math).forEach(function(key) {
	if (/atan|asin|acos/.test(key))
		window[key] = function(side) { return Math[key](side) * 180 / PI; }
	else if (/tan|sin|cos/.test(key))
		window[key] = function(angle) { return Math[key](angle / 180 * PI); }
	else
		window[key] = Math[key];
});

function setCursorImage(path, canvas) {
	(canvas || document.getElementById('canvas')).style.cursor = 'url(' + path + '), auto';
}

function mpoint(x, y, context, scale, offsetX, offsetY, mesh, aspectRatio) {
	scale = scale || 1;
	if (mesh)
		context.fillRect(offsetX + x * (scale + 1) + 1, offsetY + y * round((scale + 1) * aspectRatio) + 1, scale, round(scale * aspectRatio));
	else
		context.fillRect(offsetX + x * scale, offsetY + y * round(scale * aspectRatio), scale, round(scale * aspectRatio));
}

function point(x, y, context, scale) {
	scale = scale || 1;
	context.fillRect(x * scale, y * scale, scale, scale);
}

function dot(x, y, context, scale, rotation) {
	scale = scale || 1;
	rotation = rotation || 0;
	context.ellipse(x * scale, y * scale, scale, scale, rotation); //startAngle, endAngle, anticlockwise
}

function lineTo(x, y, context/*, scale*/) {
	context.lineTo(x, y);
}

/*function point3d(x, y, z, context, scale) {
	context.fillRect(x * scale, y * scale, z * scale, scale, scale);
}*/

function mesh(width, height, canvas, scale, offsetX, offsetY, color, aspectRatio) {
	canvas = canvas || document.getElementById('canvas');
	var context = canvas.getContext('2d'),
		rounded = round((scale + 1) * aspectRatio);
	context.fillStyle = color || '#BBB';
	for (var i = 0; i <= width; i++)
		context.fillRect(offsetX + i * (scale + 1), offsetY, 1, height * rounded + 1);
	for (var i = 0; i <= height; i++)
		context.fillRect(offsetX, offsetY + i * rounded, width * (scale + 1) + 1, 1);
}

function stop(object) {
	clearTimeout(object.handle);
}

function clear2d(canvas) {
	canvas = canvas || document.getElementById('canvas');
	var context = canvas.getContext('2d');
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
}

var distance = function(a, b) {
	var diffX = b[0] - a[0], diffY = b[1] - a[1];
	return Math.floor(Math.sqrt(diffX * diffX + diffY * diffY));
}

var direction = function(a, b) {
	return Math.atan2(b[0] - a[0], b[1] - a[1]);
}

var midpoint = function(a, b) {
	return [
		(b[0] + a[0]) / 2,
		(b[1] + a[1]) / 2
	];
}

function radialGradient(context, thickness, hardness, color, outerColor) {
	var hthickness = thickness / 2,
		gradient = context.createRadialGradient(hthickness, hthickness, hthickness * hardness, hthickness, hthickness, hthickness);
		console.log('c', color)
	gradient.addColorStop(0, color || '#000');
	gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
	//TODO: brushing too often for this to work, we need another method
	return gradient;
}

var brushes = {
	pencil: function(context, current, previous) {
		var middle = midpoint(current, previous);
		context.quadraticCurveTo(previous[0], previous[1], middle[0], middle[1]);
		//lineTo(current[0], current[1], context);
		context.stroke();
	},
	brush: function(context, current, previous, data) { //if hardness = 1, use pencil
		//TODO: quadratic curve, make transparency work
		var dist = distance(previous, current),
			angle = direction(previous, current),
			sin = Math.sin(angle),
			cos = Math.cos(angle),
			thickness = context.lineWidth,
			hthickness = thickness / 2,
			x = previous[0] - sin,
			y = previous[1] - cos;
		if (thickness !== data.brush.thickness) {
			var gradient = radialGradient(context, thickness, /*0.5*/ 0.5 /*hardness*/);
			data.brush.thickness = thickness;
			context.fillStyle = gradient;
		}
		for (var i = 0; i < dist; i++) {
			x += sin;
			y += cos;
			context.save();
			context.translate(x - hthickness, y - hthickness);
			context.fillRect(0, 0, thickness, thickness);
			context.restore();
		}
	},
	init: {
		pencil: function(context, current) {
			context.beginPath();
			//context.moveTo(current[0], current[1]);
		},
		brush: function(context, current, data) {
			if (!data.brush)
				data.brush = {};
		}
	},
	end: {
		pencil: function(context) {
			context.closePath();
		},
		brush: function() {
		}
	}
}

function Draw(config, canvas, tools, toolbar) {
	//TODO: prepend #toolbar
	//TODO: toolbar thing
	config = config || {};
	canvas = canvas || document.getElementById('canvas');
	toolbar = toolbar || document.getElementById('toolbar');
	var context = canvas.getContext('2d'),
		mouseIsDown = false,
		scale = config.scale || 1,
		//assume it's a wallpaper
		width = config.width || window.screen.width,
		height = config.height || window.screen.height,
		steps = [],
		index = 0,
		object = {
			undo: function() {
				if (index > 0)
					context.putImageData(steps[--index], 0, 0);
			},
			redo: function() {
				if (index < steps.length - 1)
					context.putImageData(steps[++index], 0, 0);
			}
		},
		usePoints = false,
		scale = 1,
		previous, current,
		data = {};
	tools = tools || [
		['<input type="number" class="input thickness"></input>', {
			onchange: function() { //it's button.onchange
				console.log(this, this.value, context.lineWidth)
				context.lineWidth = this.value;
			}
		}]
	];
	var $toolbar = new Toolbar(toolbar, tools);
	//todo: why reset
	console.log(context.lineCap)
	var initBrush = config.initBrush || brushes.init.brush,
		endBrush = config.endBrush || brushes.end.brush;
	steps.push(context.getImageData(0, 0, width, height));
	canvas.onmousedown = function(e) {
		mouseIsDown = true;
		previous = current = [e.offsetX, e.offsetY];
		initBrush(context, current, data);
	}
	canvas.onmouseup = function(e) {
		if (index !== steps.length - 1)
			steps.splice(index + 1, steps.length);
		endBrush(context, data);
		mouseIsDown = false;
		steps.push(context.getImageData(0, 0, width, height));
		index++;
	}
	var dist, angle, sin, cos, isin, icos, paint = config.paint || brushes.brush;
	canvas.onmousemove = function(e) {
		if (!mouseIsDown)
			return;
		current = [e.offsetX, e.offsetY];
		paint(context, current, previous, data);
		previous = current;
	}
	document.onkeypress = function(e) {
		var key = e.key || e.code.replace(/Key|Digit/, '');
		if (e.ctrlKey && key === 'Z') {
			if (e.shiftKey)
				object.redo();
			else
				object.undo();
		}
	}
	canvas.height = height;
	canvas.width = width;
	context.lineJoin = context.lineCap = 'round';
	steps.push(context.getImageData(0, 0, width, height)); //initial image
	return object;
}

//TODO: collision

function MassiveBody(mass, radius, config) {
	config = config || {};
	this.mass = mass;
	this.radius = config.radius || 0;
	this.x = config.x || 0;
	this.y = config.y || 0;
}

function PhysicsSimulation(config) {
	this.acceleration = config.acceleration || 9.8;
}

PhysicsSimulation.prototype.tick = function(time) {
	this.velocity += time * this.acceleration;
	this.displacement += time * this.velocity;
}

function GravitySimulation() {
	//
}

GravitySimulation.__defineGetter__('gravity', function() { return this.acceleration; });
GravitySimulation.__defineSetter__('gravity', function(value) { this.acceleration = value; });

GravitySimulation.prototype = PhysicsSimulation;

HTMLCanvasElement.prototype.download = function(filename, type) {
	type = type || 'png';
	var link = document.createElement("a");
	link.style.display = 'none';
	link.download = filename;
	link.target = "_blank";
	link.href = dataUrl;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete window.link;
}