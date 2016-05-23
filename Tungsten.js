//requires canvas.js
'use strict';

//TODO: animated 1d/2d cellular automata, and turing Machine

var _Array = [].constructor;

var n = document.createTextNode.bind(document);

//TODO: custom object (to translate mathematica notation to)

stdlib.init(this);

_Array.prototype.toMathJax = function() {
	var mathjax = this.map(function(item) { return item.toMathJax(); });
	var length = this.length * 2 - 1;
	var returns = [n('{')];
	for (var i = 0; i < this.length; i++) {
		var item = mathjax[i];
		if (item instanceof _Array)
			for (var j = 0; j < item.length; j++)
				returns.push(item[j]);
		else
			returns.push(mathjax[i]);
		returns.push(n(', '));
	}
	returns.pop();
	returns.push(n('}'));
	return returns;
}

Number.prototype.toMathJax = function() {
	return n(this.toString());
}

Big.prototype.toMathJax = function() {
	return n(this.toString());
}

String.prototype.toMathJax = function() {
	return n(this.toString());
}

HTMLCanvasElement.prototype.toMathJax = function() {
	return this;
}

Number.prototype.isComplexInfinity = function() {
	return this === Infinity || this === -Infinity;
}

//TODO:
//assignment
//HTMLCanvasElement = canvas, join properly (in arrays and stuff - createTextNode)
//createTextNode()

/// Colors

var Red = '#F00',
	Green = '#0F0',
	Blue = '#00F',
	Black = '#000',
	White = '#FFF',
	Gray = '#888',
	Cyan = '#0FF',
	Tgenta = '#F0F',
	Yellow = '#FF0',
	Brown = '#996633',
	Pink = '#F88',
	Orange = '#F80',
	Purple = '#808',
	LightRed = '#FFD8D8',
	LightGreen = '#D8FFD8',
	LightBlue = '#D8D8FF',
	LightGray = '#ECECEC',
	LightCyan = '#D8FFFF',
	LightTgenta = '#FFD8FF',
	LightYellow = '#FFFFD8',
	LightBrown = '#F1E9F1',
	LightPink = '#FFECEC',
	LightOrange = '#FFECD8',
	LightPurple = '#ECD8EC',
	Transparent = 'rgba(255, 255, 255, 0)',
	Rainbow = function(value) { return 'hsl(' + (value * 360) + ',50%,50%)'; }, //TODO: fix distribution
	Hue = function(value) { return 'hsl(' + (value * 360) + ',100%,50%)'; };

/// Constants

var None = undefined,
	True = true,
	False = false,
	Automatic = 1,
	All = {}; //object so it is compared via reference

var Tungsten = {
		index: 0,
		'%': 0,
		parse: (function() {
			var brackets = {'[': '(', ']': ')', '{': '[', '}': ']'};
			return function(str) {
				var result = str.replace(/[\[\]{}]/g, function(match) { return brackets[match]; }) //TODO: {objects->...}
					.replace(/%/g, 'T[\'%\']')
					.replace(/##/g, 'Array.from(arguments)')
					.replace(/#((?:\d|\w)+)/g, 'arguments[$1]')
					.replace(/#/g, 'arguments[0]')
					.replace(/(!=|[\+\-\*\/!])((?:\d|\w)+)/g, '[\'$1\']($2)'); //TODO: optimize out
				var match;
				while (match = /[(,]([^&,]+)&/.exec(result))
					result = result.replace(match[1] + '&', 'function() { return ' + 'a' + '; }');
				return result;
			}
		})(),
		stringify: function(object) {
			var brackets = {'(': '[', ')': ']', '[': '{', ']': '}'};
			return function(str) {
				return str.replace(/[(){}]/g, function(match) { return brackets[match]; })
					.replace(/&/g, 'T[\'%\']')
					.replace(/Array\.from\(arguments\)/g, '##')
					.replace(/arguments\[(.*)\]/g, '#$]')
					.replace(/#/g, 'arguments[0]');
					//.replace(/(!=|[\+\-\*\/!])((?:\d|\w)+)/g, '[\'$1\']($2)');
			}
		}
	},
	T = Tungsten;

Tungsten.REPL = function(form, input, output) {
	form.onsubmit = function() {
		var expression = input.value;
		input.value = '';
		//TODO: create a canvas if needed
		var row = document.createElement('tr'),
			label = document.createElement('td'),
			cell = document.createElement('td'),
			outRow = document.createElement('tr'),
			outLabel = document.createElement('td'),
			outCell = document.createElement('td');
		label.classList = 'tungsten in';
		label.innerText = 'In[' + Tungsten.index + ']:=';
		row.appendChild(label);
		cell.innerText = expression;
		row.appendChild(cell);
		output.appendChild(row);
		outLabel.classList = 'tungsten out';//createtextnode
		outLabel.innerText = 'Out[' + Tungsten.index + ']:=';
		var result = execute(expression).toMathJax();
		if (!(result instanceof _Array))
			outCell.appendChild(result);
		else
			for (var i = 0; i < result.length; i++)
				outCell.appendChild(result[i]);
		outRow.appendChild(outLabel);
		outRow.appendChild(outCell);
		output.appendChild(outRow);
		output.scrollTop = output.scrollHeight;
		window.location.hash = '';
		window.location.hash = 'form';
		Tungsten.index++;
		return false;
	}
}

function mlet(key, value) {
	Tungsten[key] = value;
}

function execute(input) {
	try {
		return eval('run(function() { return (' + Tungsten.parse(input) + '); });');
	} catch(e) {
		//ignored
	}
}

function run(func) {
	var result = func();
	T['%'] = result;
	return result;
}

var Examples = {
	Array: [
		//// # = argument, #1 = argument 1, ## = all arguments
		//// ## is equivalent to just using a function if possible
		//// Basic Examples
		//function() { return Array('f', 10); },
		function() { return Array(function(i) { return 1 + i * i; }, 10); },
		//function() { return Array('f', [3, 2]); },
		function() { return Array(function(i, j) { return 10 * i + j; }, [3, 4]); },
		//function() { return Array('f', 10, 0); },
		//function() { return Array('f', [2, 3], [0, 4]); },
		//function() { return Array('f', 10, [0, 1]); },
		//function() { return Array('f', [2, 3], [[-1/2, 1/2], [0, 1]]); },
		function() { return Array(FromDigits, [2, 3, 4]); },
		//function() { return Array('a', [2, 3], 1, Plus); }, //TODO: Plus means Plus(...) instead of List(...)
		function() { return Array(0, [3, 3]); },
		//function() { return Array(Signature, [3, 3, 3]); }, //TODO: signature
		//function() { return MatrixForm(Boole(Array(Greater, 5, 5))); }, // Boole(Array(Greater, 5, 5)) // MatrixForm
		//function() { mlet('m',  Array('a_{' + _Array.from(arguments).join(',') + '}', [3, 4]); return Tungsten.m; }, //TODO: tke it global?
	],
	Table: [
		function() { return Table(function(_) { return _.i * _.i; }, ['i', 10]); },
		//function() { return Table(function(_) { return f(_.i); }, ['i', 0, 20, 2]); },
		//function() { return Table('x', 10); },
		function() { return Table(function(_) { return 10['*'](_.i)['+'](_.j); }, ['i', 4], ['j', 3]); },
		//MatrixForm(T['%'])
		//function() { return [First(Timing(function() { return (ca = ConstantArray(0, [2000, 2000])); })), First(Timing(function() { return (a = Array(0, [2000, 2000])); })), ca['='](a)]; },
	],
	ArrayPlot: [
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, 0, 1, 0.7]]); },
		function() { return ArrayPlot([[1, 0, 0, Pink], [1, 1, 0, Pink], [1, 0, 1, Red]]); },
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, 0, 1, 0.7]], {ColorRules: {1: Pink, 0: Yellow}}); },
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, 0, 1, 0.7]], {Mesh: True}); },
		function() { return ArrayPlot(RandomReal(1, [10, 20])); },
		function() { return ArrayPlot(RandomReal(1, [10, 20]), {ColorFunction: Rainbow}); },
		function() { return ArrayPlot([[-1, 0, 1], [2, 3, 4]]); },
		function() { return ArrayPlot(RandomChoice([Red, Green, Blue], [5, 10])); },
		function() { return ArrayPlot([[1], [1, 1], [1, 0, 1], [1, 1, 1, 1]], {Background: Cyan}); },
		function() { return ArrayPlot(Table(function(_) { return _.x === _.y ? None : 1 / (_.x - _.y); }, ['x', -2, 2], ['y', -2, 2]), {Background: Cyan}); },
		function() { return ArrayPlot(SparseArray([function(_) { return _.x === _.x ? 1 : abs(x.minus(y).minus(3).isNegative() ? .5 : undefined); }, [10, 10]]), {Mesh: True}); },
		function() { return ArrayPlot(Mod(Array(Binomial, [32, 32], 0), 2), {AspectRatio: Automatic}); },
		function() { return ArrayPlot(Mod(Array(Binomial, [32, 32], 0), 2), {AspectRatio: 1/2}); },
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, 0, 1, 0.7]], {Background: Blue}); },
		function() { return ArrayPlot([[1, 0, 0, None], [1, 1, 0, None], [1, None, 1, 0.7]], {Background: Blue}); },
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, None, 1, 0.7]], {Background: Blue, PlotRange: [0.2, 1]}); },
		function() { return ArrayPlot([[1, 0, 0, 0.3], [1, 1, 0, 0.3], [1, None, 1, 0.7]], {Background: Blue, PlotRange: [0.2, 1], ClippingStyle: Red}); },
		function() { return ArrayPlot(Table(function(_) { return _.x + _.y; }, ['x', -10, 10], ['y', -10, 10]), {PlotRange: [-10, 10]}); },
		function() { return ArrayPlot(Table(function(_) { return _.x + _.y; }, ['x', -10, 10], ['y', -10, 10]), {PlotRange: [-10, 10], ClippingStyle: Red}); },
		function() { return ArrayPlot(Table(function(_) { return _.x + _.y; }, ['x', -10, 10], ['y', -10, 10]), {PlotRange: [-10, 10], ClippingStyle: [Blue, Red]}); },
		function() { return ArrayPlot(RandomReal(1, [10, 20]), {ColorFunction: Hue}); },
		//modhue
		//pastel
		function() { return ArrayPlot(Array(GCD, [20, 20]), {ColorFunction: function(value) { return value === 1 ? Black : White; }, ColorFunctionScaling: False}); },
		function() { return ArrayPlot(Array(GCD, [20, 20]), {ColorFunction: Hue, ColorFunctionScaling: True}); },
		function() { return ArrayPlot(Array(GCD, [20, 20]), {ColorRules: {1: Red, 2: Blue, 3: Yellow, _: Gray}}); },
		function() { return ArrayPlot(Array(GCD, [20, 20]), {ColorRules: {1: Red}}); },
		//function() { return ArrayPlot(Transpose(Permutations(['a', 'b', 'c'])), {ColorRules: {a: Red, b: Yellow, c: Blue}, Mesh: True}); },
		function() { return ArrayPlot([[1, 0, 1], [1, 2, 1], [1, 0, 3]], {ColorRules: {1: Blue, 0: Green, _: Black}}); },
		//TODO: use any patterns in colorrules
		//TODO: rules are used in order given (not for JS)
		//stuff
		//function() { return ArrayPlot(Array(GCD, [10, 10]), {PlotRange: 3}); } //TODO: singular plotrange
		function() { return ArrayPlot(PadLeft(Table(function(_) { return IntegerDigits(pow(3, _.n), 2); }, ['n', 70]))); },
		function() { return ArrayPlot([Range(0, 1, .01)], {AspectRatio:1/4, ColorFunction:Hue}); },
		function() { return ArrayPlot(Table(function(_) { return 1 / (_.x * _.x + _.y * _.y); }, ['x', -5, 5], ['y', -5, 5]), {ColorRules: {ComplexInfinity: Red}}); },
		//TODO: order correctly
		function() { return ArrayPlot(Mod(Array(Binomial, [32, 32], 0), 2), {Frame: False}); },
		//function() { return ArrayPlot(CellularAutomaton(30, [[1], 0], 10), {Mesh: All}); },
		//function() { return ArrayPlot(CellularAutomaton(30, [[1], 0], 10), {Mesh: [15, 5]}); },
		//function() { return ArrayPlot(CellularAutomaton(30, [[1], 0], 10), {Mesh: [None, Range(10)]}); },
		//function() { return ArrayPlot(CellularAutomaton(30, [[1], 0], 10), {Mesh: [None, Table(function(_) { return [_.i, Hue(_.i / 10)]; }, ['i', 0, 10])]}); },
		//function() { return ArrayPlot(CellularAutomaton(30, [[1], 0], 10), {Mesh: [[1, 2], None]}); },
		//mesh spec: all, [number or range, number or range] - number - evenly spaced, range - every unit
		//range ty be [[number, color]]
		function() { return ArrayPlot(RandomReal(1, [10, 20]), {Mesh: All}); },
		function() { return ArrayPlot(RandomReal(1, [10, 20]), {Mesh: All, MeshStyle: Pink}); },
	]
}
//TODO: binomial
/*
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
start + interval * number
ctx.font = "30px Arial";
ctx.measureText()
ctx.fillText("Hello World",10,50);
*/

function SparseArray() {
	//TODO:
}

var Mod = (function() {
	function _Mod(object, mod) {
		var result = [];
		for (var i = 0; i < object.length; i++) {
			var item = object[i];
			if (item instanceof _Array)
				result.push(_Mod(item, mod));
			else
				result.push(item['%'](mod));
		}
		return result;
	}
	function _ModUnbox(object, mod) {
		var result = [];
		for (var i = 0; i < object.length; i++) {
			var item = object[i];
			if (item instanceof _Array)
				result.push(_ModUnbox(item, mod));
			else
				result.push(parseInt(item['%'](mod).valueOf()));
		}
		return result;
	}
	return function(object, mod) {
		var unbox = mod.minus(Number.TX_SAFE_INTEGER).isNegative();
		if (object instanceof _Array)
			return unbox ? _ModUnbox(object, mod) : _Mod(object, mod);
		else
			return unbox ? parseInt(object['%'](mod).valueOf()) : object['%'](mod); //TODO: faster bigint tostring
	}
})();

function FromDigits() {
	return _Array.from(arguments).reduce(function(p, c) { return p['*'](10)['+'](c); }, 0);
}

function Binomial(m, n) { //TODO: wat - inconsistent with GCD
	if (m['-'](n).isNegative())
		return 0;
	return m['!']()['/'](m['-'](n)['!']()['*'](n['!']()));
}

function RandomExample(type) {
	return Examples[type][Number.random(Examples[type].length)]();
}

var global = {
	scale: 8
}

var IntegerDigits = baseArray;

function PadLeft(array, pad) {
	var length = array.reduce(function(p, c) { return max(p, c.length); }, 0);
	return array.map(function(arr) { return arr.padLeft(length); });
}

function PadRight(array) {
	var length = array.reduce(function(p, c) { return max(p, c.length); }, 0);
	return array.map(function(arr) { return arr.padRight(length); });
}

function Permutations(array) {
	//
}

function Transpose(array) {
	var result = [];
	for (var i in array) {
		var row = array[i]
		for (var j in row)
			result[j][i] = row[j];
	}
	return result;
}

function If(condition, trueValue, falseValue) {
	return condition ? trueValue : falseValue;
}

function Listable(func, value) {
	if (value instanceof _Array)
		return value.map(function (item) { return Listable(func, item); });
	return func(value);
}

function Boole(value) {
	if (value instanceof _Array)
		return Listable(Boole, value);
	return value === True ? 1 : value === False ? 0 : undefined;
}

function Greater(left, right) {
	return left.gt(right);
}

function GreaterEquals(left, right) {
	return left.gte(right);
}

function Less(left, right) {
	return left.lt(right);
}

function LessEquals(left, right) {
	return left.lte(right);
}

function GreaterThan(number) {
	return function(num) { return num.gt(number); }
}

function GreaterEqualThan(number) {
	return function(num) { return num.gte(number); }
}

function LessThan(number) {
	return function(num) { return num.lt(number); }
}

function LessEqualThan(number) {
	return function(num) { return num.lte(number); }
}

function Range(start, end, step) {
	var result = new _Array(floor((end - start) / step)); // + 1 after step? (include endpoint?)
	for (var i = 0; i < result.length; i++)
		result[i] = start + step * i;
	return result;
}

function _RecursivelyMutate(object, keys, fillEmpty, value) {
	var result = object;
	for (var i = 0; i < keys.length - 1; i++) {
		var key = keys[i];
		if (!result[key] && fillEmpty)
			result[key] = [];
		result = result[key];
	}
	result[keys[keys.length - 1]] = value;
}

function Plus() {
	return arguments.reduce(function(p, c) { return p.plus(c); }, 0);
}

var Timing = timing;

function First(array) {
	return array[0];
}

function Last(array) {
	return array[array.length - 1];
}

function ConstantArray(c, n) {
	var result = c;
	if (!(n instanceof _Array))
		n = [n];
	for (var i = 0; i < n.length; i++)
		result = [result].repeat(n[i]);
	return result;
}

function Array(f, n, r) {
	if (this instanceof Array) //NOTE: this is array
		return _Array.apply(null, arguments);
	if (typeof f !== 'function')
		f = (function() {
			var oldF = f;
			return function() { return oldF; }
		})();
	if (!(n instanceof _Array))
		n = [n];
	if (r instanceof _Array && r.length !== n.length && !(r[0] instanceof _Array))
		r = [r];
	r = r === undefined ? new _Array(n.length).fill(1) : r instanceof _Array ? r : new _Array(n.length).fill(r);
	var result = [],
		length = n.length,
		totalIndices = n.length ? n.reduce(function(p, c) { return p * c; }) : 0;
	if (r[0] instanceof _Array) { //TODO: finish
		var indices = r.map(function(_) { return _[0]; }),
			zeroBased = new Array(n.length).fill(0),
			steps = r.map(function(_, i) { return (_[1] - _[0]) / (n[i] - 1); });
		for (var i = 0; i < totalIndices; i++) { //TODO: change to thing because faster?
			for (var j = length - 1; j; j--)
				if (indices[j] >= r[j][1]) {
					indices[j] = r[j][0];
					zeroBased[j] = 0;
					indices[j - 1] += steps[j - 1];
					zeroBased[j - 1]++;
				} else
					break;
			_RecursivelyMutate(result, zeroBased, true, f.apply(null, indices));
			indices[length - 1] += steps[length - 1];
			zeroBased[length - 1]++;
		}
	} else {
		var indices = r.slice(0),
			zeroBased = new Array(n.length).fill(0);
		for (var i = 0; i < totalIndices; i++) {
			for (var j = length - 1; j; j--)
				if (indices[j] >= n[j] + r[j]) {
					indices[j] = r[j];
					zeroBased[j] = 0;
					indices[j - 1]++;
					zeroBased[j - 1]++;
				} else
					break;
			_RecursivelyMutate(result, zeroBased, true, f.apply(null, indices));
			indices[length - 1]++;
			zeroBased[length - 1]++;
		}
	}
	return result;
}

Array.prototype = [].constructor.prototype;
(function() {
	var things = Object.getOwnPropertyNames(_Array); //TODO: es5
	things.splice(things.indexOf('length'), 1);
	things.splice(things.indexOf('name'), 1);
	things.splice(things.indexOf('caller'), 1);
	things.splice(things.indexOf('arguments'), 1);
	for (var i = 0; i < things.length; i++)
		Array[things[i]] = _Array[things[i]];
})();

function Table(func, x, y) { // for ES5 compatibility
	if (!(x instanceof _Array))
		return [func].repeat(x);
	if (x.length === 2)
		x.splice(1, 0, 1);
	if (y && y.length === 2)
		y.splice(1, 0, 1);
	if (x.length === 3)
		x.splice(3, 0, 1);
	if (y && y.length === 3)
		y.splice(3, 0, 1);
	var result = [];
	if (!y) {
		for (var i = x[1]; i <= x[2]; i += x[3]) {
			var object = {};
			object[x[0]] = i; // also for ES5 compatibility
			result.push(func(object));
		}
		return result;
	}
	for (var i = x[1]; i <= x[2]; i += x[3]) {
		var row = [];
		for (var j = y[1]; j <= y[2]; j += y[3]) {
			var object = {};
			object[x[0]] = i; // also for ES5 compatibility
			object[y[0]] = j;
			row.push(func(object));
		}
		result.push(row);
	}
	return result;
}

function RandomChoice(possibilities, size) {
	var length = possibilities.length;
	return new Array(size[0]).fillWith(function() {
		return new Array(size[1]).fillWith(function () { return possibilities[Number.random(length)]; });
	});
}

function RandomReal(maximum, size) {
	return new Array(size[0]).fillWith(function() {
		return new Array(size[1]).fillWith(Math.random);
	});
}

function _max(a, b) {
	if (!(typeof a === 'number') || a === Infinity)
		return b;
	if (!(typeof b === 'number') || b === Infinity)
		return a;
	return max(a, b);
}

function _min(a, b) {
	if (!(typeof a === 'number'))
		return b;
	if (!(typeof b === 'number'))
		return a;
	return min(a, b);
}

function ArrayPlot(array, config, canvas) {
	if (array.length === 1 && array[0].length === 0)
		return;
	config = config || {};
	canvas = canvas || document.createElement('canvas');
	var PixelConstrained = config.PixelConstrained || global.scale,
		ColorRules = config.ColorRules || {},
		ColorFunction = config.ColorFunction || function(value) { return 'hsl(0,0%,' + round((1 - abs(value / maximum)) * 100) + '%)'; },
		ColorFunctionScaling = config.ColorFunctionScaling === undefined ? !!config.ColorFunction : config.ColorFunctionScaling,
		PlotRange = config.PlotRange,
		Background = config.Background || '#FFF',
		Frame = config.Frame === false ? false : true,
		FrameWidth = +Frame,
		ClippingStyle = config.ClippingStyle || Background || '#FFF',
		highColor = ClippingStyle instanceof Array ? ClippingStyle[1] : undefined,
		lowColor = ClippingStyle instanceof Array === 'Array' ? ClippingStyle[0] : undefined,
		AspectRatio = config.AspectRatio, //ratio of height to width
		Mesh = config.Mesh,
		MeshStyle = config.MeshStyle || '#BBB',
		fullMesh = Mesh === All,
		maximum = PlotRange ? 1 : array.map(function(_) { return _.reduce(_max, 0) } ).reduce(_max, 0),
		minimum,
		context = canvas.getContext('2d'),
		height = array.length,
		width = array.reduce(function(a, b) { return max(a, b.length); }, 0),
		scaleY = AspectRatio ? (width * AspectRatio) / height : 1;
		//TODO: fix border and stuff
	if (config.DataReversed)
		array = array.reverse();
	if (ColorFunctionScaling) {
		maximum = array.map(function(_) { return _.reduce(_max) } ).reduce(_max); //TODO
		minimum = array.map(function(_) { return _.reduce(_min) } ).reduce(_min);
	}
	//PlotRange = [2, 6, All, 3]
	var backgroundWidth = round(PixelConstrained / 10),
		backgroundWidth2 = backgroundWidth + FrameWidth;
	canvas.height = Mesh ? height * (PixelConstrained * scaleY + 1) + 1 + backgroundWidth * 2 : height * PixelConstrained * scaleY + backgroundWidth * 2;
	canvas.width = Mesh ? width * (PixelConstrained + 1) + 1 + backgroundWidth * 2 : width * PixelConstrained + backgroundWidth * 2;
	if (Frame) {
		canvas.height += 2;
		canvas.width += 2;
		context.fillStyle = '#888';
		context.fillRect(0, 0, (PixelConstrained + +fullMesh) * width + backgroundWidth * 2 + +fullMesh + 2, (PixelConstrained * scaleY + +fullMesh) * height + backgroundWidth * 2 + +fullMesh + 2);
	}
	context.fillStyle = Background;
	context.fillRect(FrameWidth, FrameWidth, (PixelConstrained + +fullMesh) * width + backgroundWidth * 2 + +fullMesh, (PixelConstrained * scaleY + +fullMesh) * height + backgroundWidth * 2 + +fullMesh);
	context.fillStyle = highColor || ClippingStyle;
	context.fillRect(backgroundWidth2, backgroundWidth2, (PixelConstrained + +fullMesh) * width + +fullMesh, (PixelConstrained * scaleY + +fullMesh) * height + +fullMesh);
	if (fullMesh || Mesh === True)
		mesh(width, height, canvas, PixelConstrained, backgroundWidth2, backgroundWidth2, MeshStyle, scaleY);
	if (PlotRange)
		for (var i in array) {
			if (!array.hasOwnProperty(i))
				continue;
			var index = parseInt(i);
			if (Number.isNaN(i))
				continue;
			var row = array[i];
			for (var j = 0; j < width; j++) {
				if (!row.hasOwnProperty(i))
					continue;
				var index = parseInt(j);
				if (Number.isNaN(j))
					continue;
				var value = row[j], fill = undefined;
				if (value === undefined || (fill = ColorRules[value] || ColorRules._));
				else if (typeof value === 'number')
					fill = value >= PlotRange[0] && value <= PlotRange[1] ?
						'hsl(0,0%,' + round((1 - (value - PlotRange[0]) / (PlotRange[1] - PlotRange[0])) * 100) + '%)' :
						value < PlotRange[0] ? lowColor : undefined;
				else
					fill = value;
				if (fill) {
					context.fillStyle = fill;
					mpoint(j, i, context, scaleY * PixelConstrained, backgroundWidth2, backgroundWidth2, Mesh, scaleY);
				}
			}
		}
	else if (ColorFunctionScaling)
		for (var i in array) {
			if (!array.hasOwnProperty(i))
				continue;
			var index = parseInt(i);
			if (Number.isNaN(i))
				continue;
			var row = array[i];
			for (var j in row) {
				if (!row.hasOwnProperty(i))
					continue;
				var index = parseInt(j);
				if (Number.isNaN(j))
					continue;
				var value = row[j], fill = undefined;
				if (value === undefined || (fill = ColorRules[value] || ColorRules._));
				else if (typeof value === 'number')
					fill = ColorFunction((value - minimum) / (maximum - minimum));
				else
					fill = value;
				if (fill) {
					context.fillStyle = fill;
					mpoint(j, i, context, PixelConstrained, backgroundWidth2, backgroundWidth2, Mesh, scaleY);
				}
			}
		}
	else
		for (var i in array) {
			if (!array.hasOwnProperty(i))
				continue;
			var index = parseInt(i);
			if (Number.isNaN(i))
				continue;
			var row = array[i];
			for (var j in row) {
				if (!row.hasOwnProperty(j))
					continue;
				var index = parseInt(j);
				if (Number.isNaN(j))
					continue;
				var value = row[j], fill = undefined;
				if (value && value.isComplexInfinity && value.isComplexInfinity() && ColorRules.ComplexInfinity)
					fill = ColorRules.ComplexInfinity;
				else if ((fill = ColorRules[value] || ColorRules._)) {
				} else if (value === undefined) {
				} else if (typeof value === 'number')
					fill = ColorFunction(value);
				else
					fill = value;
				if (fill) {
					context.fillStyle = fill;
					mpoint(j, i, context, PixelConstrained, backgroundWidth2, backgroundWidth2, Mesh, scaleY);
				}
			}
		}
	return canvas;
}

function CellularAutomaton(ruleNumber, initialState, iterations) {
	//initial spec:
	//initial
	//[initial, filler || 0]
	//[[[initial, [offset]], [initial, [offset]]], filler || 0]
	//[]
	var rule = IntegerDigits(ruleNumber, 2).padLeft(8, 0).reverse(),
		state = initialState,
		states = [initialState],
		iteration = 0;
	for (; iteration < iterations; iteration++) {
		var newState = [];
		for (var i = 0; i < state.length; i++)
			newState.push(rule[(state[i-1<0?state.length-1:i-1])*4+state[i]*2+(state[i+1>=state.length?0:i+1])]);
		state = newState;
		states.push(newState);
	}
	return states;
}

var Halt = {}; //object reference

function Tape() {
	//TODO: minimum
}

function TuringMachine(n, init, dim) {
	if (arguments.length === 1) {
		this.rules = IntegerDigits(n, 2).padLeft(12, 0).dice(0, 12, 1, 3).reverse()
	}
	//state table: table[state][color] => [state, color, moveright/moveleft]
}

function _GaussianFilter(axes, dimension) { //TODO: wat
	if (typeof axes === 'number')
		axes = [axes].repeat(dimension || (centers && centers.length) || 2);
	var dimensions = axes.map(function(axis) { return axis * 2 + 1; });
	if (dimension === 2 || axes.length === 2) {
		var result = [];
		var amplitude = 0;
		for (var i = 0; i < dimensions[0]; i++) {
			var row = [];
			for (var j = 0; j < dimensions[1]; j++)
				row.push(exp(-((i-axes[0])*(i-axes[0])/(2*axes[0]*axes[0])+(j-axes[1])*(j-axes[1])/(2*axes[1]*axes[1]))));
			result.push(row);
		}
		return result;
	}
}

/*function CellularAutomaton(ruleNumber, initialState, iterations, config, canvas) {
	config = config || {};
	var rule = IntegerDigits(ruleNumber, 2).padLeft(8, 0),
		state = initialState,
		scale = config.scale || 1,
		step = config.step || 5000,
		iteration = 0,
		canvas = canvas || document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.height = scale * iterations;
	canvas.width = scale * state.length;
	context.fillStyle = config.color || '#000';
	var draw = function() {
		for (var _ = 0; _ < min(step, iterations - iteration); _++) {
			for (var i = 0; i < state.length; i++) {
				if (state[i])
					mpoint(i, iteration, context, scale);
			}
			iteration++;
			var newState = [];
			for (var i = 0; i < state.length; i++)
				newState.push(rule[(state[i-1]||0)*4+(state[i]||0)*2+(state[i+1]||0)]);
			state = newState;
		}
		if (iteration < iterations)
			requestAnimationFrame(draw);
	}
	draw();
}*/
//TODO: infinite tape

//2-state 2-color Machine 2506 starting with a tape consisting of four 0s:
//TuringMachine[2506, {1, {0, 0, 0, 0}}, 2]
//2-state 2-color Machine 2506 with an infinite blank tape:
//TuringMachine[2506, {1, {{}, 0}}, 6]
