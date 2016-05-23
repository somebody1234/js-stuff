var fractals = [];

function NFlake(sides, config, canvas) {
	sides = sides || 3;
	canvas = canvas || document.getElementById('canvas');
	config = config || {};
	var scale = config.scale || 1,
		side = config.side || 1024;
	canvas.width = canvas.height = side * scale;
	var radius = config.radius || side / 2,
		ratio = config.ratio,
		step = config.step || 5000,
		points = [],
		iterationsLeft = config.iterations || Infinity,
		x = config.centerX || side / 2,
		y = config.centerY || side / 2,
		originalX = x,
		originalY = y,
		spectrum = config.spectrum;
	if (!ratio)
		ratio = 1/(2*(1+sum(function(_) { return cos(360 * _ / sides); }, floor(sides/4) + 1, 1)));
	var context = canvas.getContext('2d'),
		rest = 1 - ratio,
		obj = { handle: 0, pause: function() { clearTimeout(this.handle); return this; }, delete: function() { this.pause(); delete chaosGames[this.Index]; return this; } };
	for (var i = 0; i < sides; i++)
		points.push([x+radius*sin(i*(360/sides)), y+radius*cos(i*(360/sides))]);
	var draw = spectrum ? 
		function(n) {
			for (var i = 0; i < (n || min(step, iterationsLeft)); i++) {
				var pointNumber = Math.floor(Math.random() * sides);
				x = round(points[pointNumber][0]*rest + x*ratio);
				y = round(points[pointNumber][1]*rest + y*ratio);
				var deltaX = x - originalX,
					deltaY = y - originalY;
				context.fillStyle = 'hsl(' + ((floor(atan(deltaY/deltaX))||0)+(deltaX<0?180:0)) + ',' + round((sqrt(deltaX*deltaX+deltaY*deltaY)/radius)*100) + '%,50%)';
				point(x, y, context, scale);
			}
			iterationsLeft -= n || min(step, iterationsLeft);
			if (iterationsLeft && !n)
				obj.handle = setTimeout(draw, 0);
		} :
		function(n) {
			for (var i = 0; i < (n || min(step, iterationsLeft)); i++) {
				var pointNumber = Number.random(sides);
				point(x = round(points[pointNumber][0]*rest + x*ratio), y = round(points[pointNumber][1]*rest + y*ratio), context, scale);
			}
			iterationsLeft -= n || min(step, iterationsLeft);
			if (iterationsLeft && !n)
				obj.handle = setTimeout(draw, 0);
		};
	context.fillStyle = config.color || 'rgba(0,0,0,0.1)';
	if (config.start !== false)
		draw();
	obj.resume = function() { draw(); return this; };
	obj.step = function(n) { draw(n); return this; };
	obj.index = fractals.length;
	fractals.push(obj);
	return obj;
}

function Vicsek(config, canvas) {
	canvas = canvas || document.getElementById('canvas');
	config = config || {};
	var scale = config.scale || 1,
		side = config.side || 1024;
	canvas.width = canvas.height = side * scale;
	var step = config.step || 5000,
		radius = config.radius || side/2,
		context = canvas.getContext('2d'),
		x = config.centerX || side / 2,
		y = config.centerY || side / 2,
		points = [[x, y], [0, 0], [0, 2*y], [2*x, 2*y], [2*x, 0]],
		iterationsLeft = config.iterations || Infinity,
		obj = { handle: 0, pause: function() { clearTimeout(this.handle); return this; }, delete: function() { this.pause(); delete chaosGames[this.Index]; return this; } },
		originalX = x,
		originalY = y,
		spectrum = config.spectrum;
	var draw = spectrum ? function(n) {
			for (var i = 0; i < (n || min(step, iterationsLeft)); i++) {
				var pointNumber = Math.floor(Math.random() * 5);
				x = round(points[pointNumber][0]*2/3 + x*1/3);
				y = round(points[pointNumber][1]*2/3 + y*1/3);
				var deltaX = x - originalX;
				var deltaY = y - originalY;
				context.fillStyle = 'hsl(' + ((floor(atan(deltaY/deltaX))||0)+(deltaX<0?180:0)) + ',' + round((sqrt(deltaX*deltaX+deltaY*deltaY)/radius)*100) + '%,50%)';
				point(x, y, context, scale);
			}
			iterationsLeft -= n || min(step, iterationsLeft);
			if (iterationsLeft && !n)
				obj.handle = setTimeout(draw, 0);
		} :
		function(n) {
			for (var i = 0; i < (n || min(step, iterationsLeft)); i++) {
				var pointNumber = Math.floor(Math.random() * 5);
				point(x = round(points[pointNumber][0]*2/3 + x*1/3), y = round(points[pointNumber][1]*2/3 + y*1/3), context, scale);
			}
			iterationsLeft -= n || min(step, iterationsLeft);
			if (iterationsLeft && !n)
				obj.handle = setTimeout(draw, 0);
		};
	context.fillStyle = config.color || 'rgba(0,0,0,0.1)';
	if (config.start !== false)
		draw();
	obj.resume = function() { draw(); return this; };
	obj.step = function(n) { draw(n); return this; };
	obj.index = fractals.length;
	fractals.push(obj);
	return obj;
}

function clearAllFractals() {
	for (var i = 0; i < fractals.length; i++) {
		if (fractals[i])
			fractals[i].pause();
		delete fractals[i];
	}
	clear2d();
}

function Lindenmayer(rules, initial, actions, iterations, setup, angle) {
	var state = initial,
		newState = [],
		turtle = { angle: angle },
		data = {};
	for (var i = 0; i < iterations; i++) {
		for (var j = 0; j < initial.length; j++)
			newState = newState.concat(rules[initial[j]] || [initial[j]]); //TODO: is there a faster ES5 method?
		state = newState;
		newState = [];
	}
	setup(data);
	for (var i = 0; i < state.length; i++) {
		var action = actions[state[i]];
		if (!action) //no-op/evolution control
			continue;
		//
	}
}
//TODO: lindenmayer systems, local catenativity detection