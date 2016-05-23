//requires canvas.js

'use strict';
//from https://github.com/martinpllu/cellgrid
function Direction(x, y, index, id) {
	this.x = x;
	this.y = y;
	this.index = index;
}

Direction.N = new Direction(0, 1, 0);
Direction.NE = new Direction(1, 1, 1);
Direction.E = new Direction(1, 0, 2);
Direction.SE = new Direction(1, -1, 3);
Direction.S = new Direction(0, -1, 4);
Direction.SW = new Direction(-1, -1, 5);
Direction.W = new Direction(-1, 0, 6);
Direction.NW = new Direction(-1, 1, 7);

Direction.ALL = [
	Direction.N,
	Direction.NE,
	Direction.E,
	Direction.SE,
	Direction.S,
	Direction.SW,
	Direction.W,
	Direction.NW
];

Direction.randomDirection = function () {
	return Direction.ALL[Number.random(8)];
};


Direction.randomRectDirection = function () {
	return Direction.ALL[2 * Number.random(4)];
};

function Cell(grid, x, y) {
	this.grid = grid;
	this.contents = [];
	this.x = x;
	this.y = y;
}

Cell.prototype.initNeighbors = function () {
	this.neighbors = [];
	var i, direction, nx, ny, neighbor;
	for (i = 0; i < Direction.ALL.length; i++) {
		direction = Direction.ALL[i];
		nx = this.x + direction.x;
		ny = this.y + direction.y;
		if (nx === this.grid.width)
			nx = 0;
		else if (nx === -1)
			nx = this.grid.width - 1;
		if (ny === this.grid.height)
			ny = 0;
		else if (ny === -1)
			ny = this.grid.height - 1;
		this.neighbors[i] = this.grid.cells[nx][ny];
	}
};

Cell.prototype.toString = function () {
	return '(' + this.x + ',' + this.y + ')';
};

Cell.prototype.randomNeighbor = function () {
	return this.neighbors[Number.random(8)];
};

Cell.prototype.neighbor = function (direction) {
	return this.neighbors[direction.index];
};

Cell.prototype.add = function (o) {
	this.contents.push(o);
};

Cell.prototype.remove = function (o) {
	var index = this.contents.indexOf(o);
	if (index !== -1) {
		this.contents.splice(index, 1);
		return true;
	}
	return false;
};

function Grid(config) {
	config = config || {};
	this.width = config.width || config.side || 256;
	this.height = config.height || config.side || 256;
	this.cells = [];
	this.flatCells = [];
	for (var x = 0; x < this.width; x++) {
		this.cells.push([]);
		for (var y = 0; y < this.height; y++) {
			var cell = new Cell(this, x, y);
			this.cells[x].push(cell);
			this.flatCells.push(cell);
		}
	}
	for (var x = 0; x < this.flatCells.length; x++)
		this.flatCells[x].initNeighbors();
	this.numCells = this.flatCells.length;
}

//TODO: very possibly hashlife
function SquareAutomaton(config, canvas) { //TODO: toroidalH/toroidalV
	var x, y;
	config = config || {};
	var rules = config.rules || [{
			birth: [3],
			survival: [2, 3]
		}],
		scale = config.scale || 1,
		grid = new Grid(config),
		tile = config.tile || false,
		width = config.width || config.side || 256,
		height = config.height || config.side || 256,
		fullWidth = config.fullWidth || config.fullSize || width,
		fullHeight = config.fullHeight || config.fullSize || height,
		canvas = canvas || document.getElementById('canvas'),
		context = canvas.getContext('2d');
	canvas.width = fullWidth * scale;
	canvas.height = fullHeight * scale;
	context.fillStyle = config.color || '#000';
	for (var i = 0; i < grid.numCells; i++) {
		var cell = grid.flatCells[i];
		cell.state = +(random()>(config.fill||.5));
	}
	var draw = tile ? function() {
			clear2d(canvas);
			for (var i = 0; i < fullWidth; i++) {
				var x = i % width;
				for (var j = 0; j < fullHeight; j++) {
					var cell = grid.cells[x][j % height];
					if (cell.state)
						point(i, j, context, scale);
				}
			}
			for (var i = 0; i < grid.numCells; i++) {
				var cell = grid.flatCells[i],
					n = cell.neighbors.count(cell=>cell.state);
				if (cell.state)
					cell.nextState = +rules[0].survival.includes(n); //TODO
				else
					cell.nextState = +rules[0].birth.includes(n);
			}
			for (var i = 0; i < grid.numCells; i++)
				grid.flatCells[i].state = grid.flatCells[i].nextState;
			requestAnimationFrame(draw);
		} :
		function() {
			clear2d(canvas);
			for (var i = 0; i < grid.numCells; i++) {
				var cell = grid.flatCells[i];
				if (cell.state)
					point(cell.x, cell.y, context, scale);
			}
			for (var i = 0; i < grid.numCells; i++) {
				var cell = grid.flatCells[i],
					n = cell.neighbors.count(cell=>cell.state);
				if (cell.state)
					cell.nextState = +rules[0].survival.includes(n); //TODO
				else
					cell.nextState = +rules[0].birth.includes(n);
			}
			for (var i = 0; i < grid.numCells; i++)
				grid.flatCells[i].state = grid.flatCells[i].nextState;
			requestAnimationFrame(draw);
		}
	draw();
}