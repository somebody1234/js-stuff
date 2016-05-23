function Python(window) {
	function newTypeError(functionName, expected, actual) {
		return new TypeError(functionName + ' takes exactly ' + expected + ' argument' + (expected === 1 ? '' : 's') + ' (' + actual + ' given)');
	}
	function newAtMostTypeError(functionName, expected, actual) {
		return new TypeError(functionName + ' takes at most ' + expected + ' argument' + (expected === 1 ? '' : 's') + ' (' + actual + ' given)');
	}
	function typeDescription(value) {
		if (typeof value === 'string')
			return 'string of length ' + value.length;
		else if (typeof value === 'number')
			return 'int';
		else if (value instanceof Array)
			return 'list';
	}
	function typeOf(value) {
		if (typeof value === 'string')
			return 'str';
		else if (typeof value === 'number')
			return 'int';
		else if (value instanceof Array)
			return 'list';
	}
	window.ord = function(character) {
		if (arguments.length !== 1)
			throw newTypeError('ord()', 1, arguments.length);
		if (typeof character === 'string' && character.length === 1)
			return character.charCodeAt(0);
		throw new TypeError('ord() expected string of length 1, but ' + typeDescription(character) + ' found');
	}
	window.chr = function(number) {
		if (arguments.length !== 1)
			throw newTypeError('chr()', 1, arguments.length);
		if (typeof number === 'number')
			return String.fromCharCode(number);
		throw new TypeError('an integer is required (got type ', typeOf(number) + ')');
	}
	window.str = function(object) {
		//TODO: errors
		//TODO: stringify dictionaries
		if (typeof object === 'string') //TODO: escaping and such
			return object;
		if (typeof object === 'number')
			return object.toString();
		if (object instanceof Array)
			return '[' + object.map(function(item) {return str(item);}).join(', ') + ']';
	}
	window.int = (function() {
		var R_BASE  = [,,];
		var BASE_STRING = ' 0123456789abcdefghijklmnopqrstuvwxyz';
		for (var i = 2; i <= 36; i++)
			R_BASE.push(new RegExp('^[0-' + BASE_STRING[Math.min(i, 10)] + (i > 10 ?  'a-' + BASE_STRING[i] : '') + ']+$', 'i'));
		return function(object, base) {
			if (base && typeof object !== 'string')
				throw new TypeError('int() can\'t convert non-string with explicit base');
			if (typeof object === 'number')
				return number;
			if (typeof object === 'string') {
				base = base || 10;
				if (base < 2 || base > 36)
					throw new ValueError('int() base must be >= 2 and <= 36');
				if (!R_BASE[base].test(object))
					throw new TypeError('invalid literal for int() with base 10: ' + str(object));
				return parseInt()
			}
			throw new TypeError('int() argument must be a string, a bytes-like object or a number, not \'' + typeOf(object) + '\'');
		}
	})();
	window.float = function(object) {
		if (arguments.length !== 1)
			throw newAtMostTypeError('float()', 1, arguments.length);
		if (typeof object === 'number')
			return object;
		if (typeof object === 'string') {
			if (!/^[0-9]*\.?[0-9]+$|^[0-9]+\.$/.test(object))
				throw new TypeError('could not convert string to float: ' + str(object));
			return parseFloat(object);
		}
	}

	window.True = true;
	window.False = false;
	window.None = null; //halp wai it becom undifien
}

Python(this);