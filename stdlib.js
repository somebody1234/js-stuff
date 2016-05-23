//TODO: add jQuery/underscore/lodash/backbone downloading script
//_nativeArray is for when someone is stupid (me) and overloads Array incompletely

//TODO: get lodash
'use strict';

var _nativeArray = [].constructor,
	_nativeString = ''.constructor,
	_nativeNumber = (1).constructor,
	_nativeObject = ({}).constructor;

var print = console.log.bind(console);

_nativeNumber.prototype.toOrdinal = (function() {
	var _ = [, 'st', 'nd', 'rd'];
	return function() {
		return this + (_[/1?.$/.exec(this)] || 'th');
	}
})();

_nativeArray.prototype.empty = function() {
	this.splice(0, this.length);
	return this;
}

_nativeArray.prototype.forEach = (function() {
	var forEach = _nativeArray.prototype.forEach;
	return function(name) {
		if (typeof name !== 'string') {
			forEach.apply(this, arguments);
			return;
		}
		var value = this[0][name];
		if (typeof value === 'function')
			forEach.apply(this, [function(i) { this[i][name](); }]);
	}
})();

_nativeArray.prototype.clone = function() { return this.slice(0); }

_nativeString.prototype.isUpperCase = function() { return !(/a-z/.test(this)); }
_nativeString.prototype.isLowerCase = function() { return !(/A-Z/.test(this)); }

_nativeString.prototype.words = function() {
	return this.match(/((?:^_*)?(?:[A-Z][^-_\sA-Z]*|[^-_\sA-Z]+)(?:_*$)?)/g);
}

_nativeString.prototype.toCamelCase = function() {
	return this.words()
		.map(function(_) { return _.replace(/^./, function(match) { return match.toUpperCase(); })})
		.join('')
		.replace(/^./, function(match) { return match.toLowerCase(); });
}

_nativeString.prototype.toPascalCase = function() {
	return this.words()
		.map(function(_) { return _.replace(/^./, function(match) { return match.toUpperCase(); })})
		.join('');
}

_nativeString.prototype.toSnakeCase = function() {
	return this.words()
		.map(function(_) { return _.replace(/^./, function(match) { return match.toLowerCase(); })})
		.join('_');
}

_nativeString.prototype.toConstantCase = function() {
	return this.toUpperCase().words()
		.join('_');
}

_nativeString.prototype.toSeperatedCase = function(seperator) {
	return this.words()
		.map(function(_) { return _.replace(/^./, function(match) { return match.toLowerCase(); })})
		.join(seperator);
}

_nativeString.prototype.toTitleCase = function() {
	return this.words()
		.map(function(_) { return _.replace(/^./, function(match) { return match.toUpperCase(); })})
		.join(' ');
}

_nativeString.prototype.swapCase = function() {
	return this.replace(/[a-z]/gi, function(match) {
		return match.toUpperCase() === match ? match.toLowerCase() : match.toUpperCase();
	});
}

_nativeNumber.random = function(number) {
	if (number === undefined)
		return Math.random();
	return Math.floor(number['*'](Math.random()));
}

_nativeNumber.prototype.modulo = function(number) {
	var modulo = this % number;
	return modulo < 0 ? modulo + number : modulo;
}

_nativeNumber.prototype.needsPromotion = function() {
	return this > _nativeNumber.MAX_SAFE_INTEGER;
}

_nativeString.prototype.repeat = (function() {
	var repeat = _nativeString.prototype.repeat;
	return function(times) {
		return repeat.call(this, Math.ceil(times)).slice(0, Math.round(times * this.length));
	}
})();

_nativeArray.prototype.repeat = function(times) {
	var originalLength = this.length,
		length = Math.round(this.length * times),
		self = this;
	return new _nativeArray(length).fill().map(function(_,i) { return self[i % originalLength]; });
}

_nativeArray.prototype.flatten = function(depth) {
	if (depth === 0)
		return this;
	var result = [];
	if (depth === 1) {
		for (var i = 0; i < this.length; i++)
			if (this[i] instanceof _nativeArray)
				result = result.concat(this[i].flatten(depth - 1));
			else
				result.push(this[i]);
	}
	else {
		for (var i = 0; i < this.length; i++)
			if (this[i] instanceof _nativeArray)
				result = result.concat(this[i].flatten(depth - 1));
			else
				result.push(this[i]);
	}
	return result;
}

_nativeString.prototype.padLeft = function(length, character) {
	if (this.length >= length)
		return this;
	character = character || ' ';
	return character.repeat(length - this.length) + this;
}

_nativeString.prototype.padRight = function(length, character) {
	if (this.length >= length)
		return this;
	character = character || ' ';
	return this + character.repeat(length - this.length);
}

_nativeArray.prototype.padLeft = function(length, object) {
	if (this.length >= length)
		return this;
	return [object === undefined ? 0 : object].repeat(length - this.length).concat(this);
}

_nativeArray.prototype.padRight = function(length, object) {
	if (this.length >= length)
		return this;
	return this.concat([object === undefined ? 0 : object].repeat(length - this.length));
}

_nativeString.prototype.reverse = function() {
	return _nativeArray.prototype.slice.call(this).reverse().join('');
}

_nativeArray.prototype.__defineGetter__('last', function() { return this[this.length - 1]; });
_nativeArray.prototype.__defineGetter__('first', function() { return this[0]; });
_nativeArray.prototype.__defineSetter__('last', function(value) { this[this.length - 1] = value; });
_nativeArray.prototype.__defineSetter__('first', function(value) { this[0] = value; });

_nativeArray.prototype.fillWith = function(object) {
	if (typeof object === 'function')
		for (var i = 0; i < this.length; i++)
			this[i] = object(i);
	else
		for (var i = 0; i < this.length; i++)
			this[i] = object;
	return this;
}

_nativeArray.prototype.count = function(predicate) {
	var count = 0;
	predicate = predicate === undefined ? function(_) { return _; } : predicate;
	if (typeof predicate === 'function') {
		for (var i = 0; i < this.length; i++)
			if (predicate(this[i], i, this))
				count++;
	} else {
		for (var i = 0; i < this.length; i++)
			if (this[i] === predicate)
				count++;
	}
	return count;
}

_nativeArray.prototype.where = function(predicate) {
	var result = [];
	predicate = predicate || function(_) { return _; };
	for (var i = 0; i < this.length; i++)
		if (predicate(this[i], i, this))
			result.push(this[i]);
	return result;
}

//TODO: rename
_nativeArray.prototype.dice = function(start, end, step, chunk, overlap) {
	end = end === undefined ? this.length : end;
	if (!this.length || start === end)
		return chunk ? [[]] : [];
	step = step || 1;
	var returns = [], length = this.length,
		multiplier = start < end ? 1 : -1, current = start;
	if (chunk) {
		overlap = overlap || 0;
		if (overlap >= length)
			throw 'Overlap is greater than or equal to array length';
		while (current * multiplier < end * multiplier) {
			returns.push([]);
			for (var _ = 0; _ < chunk; _++) {
				returns.last.push(this[current.modulo(length)]);
				current += multiplier * step;
			}
			current -= multiplier * overlap; //TODO: change the way this works?
		}
		return returns;
	}
	while (current * multiplier < end * multiplier) {
		returns.push(this[current.modulo(length)]);
		current += multiplier * step;
	}
	return returns;
}

_nativeArray.prototype.toString = function() {
	return '[' + this.map(function(_) { return _.toString(); }).join(', ') + ']';
}

_nativeArray.prototype.unique = function() {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		var item = this[i];
		if (!result.includes(item))
			result.push(item);
	}
	return result;
}

_nativeArray.prototype.union = function(other) {
	return this.concat(other).unique();
}

_nativeArray.prototype.intersection = function(other) {
	var unique = this.unique(),
		result = [];
	for (var i = 0; i < unique.length; i++)
		if (other.includes(unique[i]))
			result.push(unique[i]);
	return result;
}

_nativeArray.prototype.foldl = _nativeArray.prototype.reduce;
_nativeArray.prototype.foldr = _nativeArray.prototype.reduceRight = function(func, initial) {
	var result = initial || this.pop();
	for (var i = this.length - 1; i >= 0; i--)
		result = func(result, this[i]);
	return result;
}

_nativeArray.prototype.all = _nativeArray.prototype.every;
_nativeArray.prototype.any = _nativeArray.prototype.some;
_nativeArray.prototype.select = _nativeArray.prototype.map;

_nativeArray.range = function(start, end) {
	var multiplier = start < end ? 1 : -1;
	return new _nativeArray((end - start) * multiplier).fill().map(function(_, i) {return i * multiplier + start;});
}

function initjQuer() {
	$.extend({
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
		twenty: 20,
		thirty: 30,
		forty: 40,
		fifty: 50,
		sixty: 60,
		seventy: 70,
		eighty: 80,
		ninety: 90,
		hundred: 100,
		thousand: 1e3,
		myriad: 1e4,
		million: 1e6,
		billion: 1e9,
		trillion: 1e12,
		quadrillion: 1e15,
		quintillion: 1e18,
		sextillion: 1e21,
		septillion: 1e24,
		octillion: 1e27,
		nonillion: 1e30,
		decillion: 1e33,
		undecillion: 1e36,
		duodecillion: 1e39,
		tredecillion: 1e42,
		quattuordecillion: 1e45,
		quindecillion: 1e48,
		sedecillion: 1e51,
		septendecillion: 1e54,
		octodecillion: 1e57,
		novemdecillion: 1e60,
		vigintillion: 1e63,
		centillion: 1e303,
		googol: 1e100,
		inf: Infinity,
		infinity: Infinity,
		True: true,
		False: false,
		None: null,
		nil: null,
		nan: NaN,
		google: function(search) {
			var sanitized = encodeURI(search.replace(/\s+/g, '+'));
			document.location.href = 'https://www.google.com/search?q=' + sanitized + '&oq=' + sanitized;
		},
		alex: false,
		//TODO: handle non-functions as well
		andand: function(fn1, fn2) { return fn1() && fn2(); },
		oror: function(fn1, fn2) { return fn1() || fn2(); },
		and: function(fn1, fn2) { return fn1() & fn2(); },
		or: function(fn1, fn2) { return fn1() | fn2(); },
		add: function(a, b) { return a['+'](b); },
		subtract: function(a, b) { return a['-'](b); },
		multiply: function(a, b) {
			if ($.eq(a, 'Seriously?') && $.eq(b, $.two) || $.eq(b, 'Seriously?') && $.eq(a, $.two))
				return $.infinity;
			return a['*'](b);
		},
		divide: function(a, b) {
			if ($.eq(a, $.infinity) && $.eq(b, $.two))
				return 'Seriously?';
			return a['/'](b);
		},
		eq: function(a, b) { return a['='] ? a['='](b) : a === b; },
		equals: function(a, b) { return $.eq(a, b); },
		neq: function(a, b) { return !$.eq(a, b); },
		doesntequal: function(a, b) { return $.eq(a, b); },
		gt: function(a, b) { return a.gt(b); },
		gte: function(a, b) { return a.gte(b); },
		lt: function(a, b) { return a.lt(b); },
		lte: function(a, b) { return a.lte(b); },
	});
	if (_) //if lodash/underscore
		$.extend(_);
}

/*function Matrix(matrix) {
	if (!matrix instanceof _nativeArray || !matrix[0] instanceof _nativeArray)
		throw new TypeError('Input is not a two-dimensional _nativeArray');
	let length = matrix[0].length;
	if (!matrix.every(function (row) { return row instanceof _nativeArray && row.length === length; }))
		throw new TypeError('Input is a jagged _nativeArray');
	this.value = matrix; //TODO: ES5 extend _nativeArray
	this.rows = length;
	this.columns = matrix.length;
	return this;
}

Matrix.prototype.times = function(matrix) {
	var matrix = [];
	//TODO
}

Matrix.identity = function(size) {
	return new Matrix([[0].repeat(size)].repeat(size));
}*/

var stdlib = {
	modules: function(window) {
		window.export = function(object, name) {
			if (typeof define === 'function' && define.amd)
				define(function() { return object; });
			else if (typeof module !== 'undefined' && module.exports)
				module.exports = object;
			else
				window[name] = object;
		}
	},
	enum: function(window) {
		window.enumeration = function() {
			for(var i = 0; i < arguments.length; i++)
				this[arguments[i]] = Math.pow(2, i);
		}
	},
	INI: function(window) {
		window.INI = {
			parse: function(ini) {
				var object = {},
					index = -1,
					oldIndex = 0,
					lines = ini.split('\n'),
					currentSection,
					currentItem,
					match,
					currentItemName;
				for (var i = 0; i < lines.length; i++) {
					var line = lines[i];
					if (/^\s*$/.test(line))
						continue;
					if ((match=/^\s*\[([^=]*)\]\s*$/.exec(line))) {
						currentSection = {};
						object[match[1]] = currentSection;
					} else if ((match = /\s*(.*)\[\]\s*=\s*(.*)\s*/.exec(line))) {
						if (!(currentItem instanceof _nativeArray) || match[1] !== currentItemName) {
							currentItemName = match[1];
							currentItem = [match[2]];
							currentSection[match[1]] = currentItem;
						} else
							currentItem.push(match[2]);
					} else if ((match = /\s*(.*)\[\s*(.*)\s*\]\s*=\s*(.*)\s*/.exec(line))) {
						if (currentItem.constructor !== _nativeObject || match[1] !== currentItemName) {
							currentItemName = match[1];
							currentItem = {};
							currentItem[match[2]] = match[3];
							currentSection[match[1]] = currentItem;
						} else
							currentItem[match[2]] = match[3];
					} else if ((match = /\s*(.*)\s*=\s*(.*)\s*/.exec(line))) {
						currentItem = '';
						currentSection[match[1]] = match[2];
					} else
						throw new Error('Unknown line format');
				}
				return object;
			},
			stringify: function(object) {
				var inified = '';
				for (var key in object) {
					if (!object.hasOwnProperty(key))
						continue;
					var section = object[key];
					inified += '\n[' + key + ']';
					for (var name in section) {
						if (!section.hasOwnProperty(name))
							continue;
						var item = section[name];
						if (item instanceof _nativeArray)
							inified += item.map(function(o) { return '\n' + name + '[]=' + o; }).join('');
						else if (typeof item === 'object') {
							for (var objKey in item)
								if (item.hasOwnProperty(objKey))
									inified += '\n' + name + '[' + objKey + ']=' + item[objKey];
						}
						else
							inified += '\n' + name + '=' + item;
					}
					inified += '\n';
				}
				return inified.slice(1, -1);
			}
		};
	},
	prime: function() {
		//from http://www.javascripter.net/faq/numberisprime.htm
		_nativeNumber.prototype.smallestFactor = (function() {
			function trialFactor(n) {
				var r = 0, j = -1, i = _nativeArray.prototype.slice.call(arguments).slice(1);
				while (r === 0 && ++j < i.length)
					r = n % i[j] === 0 ? i[j] : 0;
				return r;
			}
			return function() {
				if (isNaN(this) || !isFinite(this))
					return NaN;  
				if (this == 0)
					return 0;
				if (this % 1 || this * this < 2)
					return 1;
				var r;
				if (r = trialFactor(this, 2, 3, 5))
					return r; 
				var m = Math.sqrt(this);
				for (var i = 7; i <= m; i  += 30)
					if (r = trialFactor(this, i, i + 4, i + 6, i + 10, i + 12, i + 16, i + 22, i + 24))
						return r;
				return this;
			}
		})();

		_nativeNumber.prototype.isPrime = function() { return this === this.smallestFactor(); };
	},
	timespan: function() {
		Date.prototype.timespan = function(other) {
			var difference = this - other;
			var seconds = difference % 60000;
			difference = Math.floor(difference/60000);
			if (!difference)
				return seconds > 1 ? seconds + ' seconds' :
					seconds === 1 ? '1 second' :
					seconds === .001 ? '1 millisecond' :
					seconds * 1000 + ' milliseconds';
			var parts = [[seconds / 1000, 'second']];
			parts.unshift([difference % 60, 'minute']);
			difference = Math.floor(difference / 60);
			parts.unshift([difference % 24, 'hour']);
			difference = Math.floor(difference / 24);
			parts.unshift([difference % 7, 'day']);
			difference = Math.floor(difference / 7);
			parts.unshift([difference, 'week']);
			var result = parts.where(function(_) { return _[0]; }).map(function(_) { return _[0] === 1 ? _[0] + ' ' + _[1] : _[0] + ' ' + _[1] + 's'; });
			if (result.length === 1)
				return result[0];
			return result.slice(0, -1).join(', ') + ' and ' + result.last;
		}
	},
	dateToFrom: function() {
		Date.prototype.weeksTo = function(other) { return Math.max(0, +other - +this) / 604800000; }
		Date.prototype.weeksFrom = function(other) { return Math.max(0, +this - +other) / 604800000; }
		Date.prototype.daysTo = function(other) { return Math.max(0, +other - +this) / 86400000; }
		Date.prototype.daysFrom = function(other) { return Math.max(0, +this - +other) / 86400000; }
		Date.prototype.hoursTo = function(other) { return Math.max(0, +other - +this) / 3600000; }
		Date.prototype.hoursFrom = function(other) { return Math.max(0, +this - +other) / 3600000; }
		Date.prototype.minutesTo = function(other) { return Math.max(0, +other - +this) / 60000; }
		Date.prototype.minutesFrom = function(other) { return Math.max(0, +this - +other) / 60000; }
		Date.prototype.secondsTo = function(other) { return Math.max(0, +other - +this) / 1000; }
		Date.prototype.secondsFrom = function(other) { return Math.max(0, +this - +other) / 1000; }
	},
	dateFluent: function() {
		Date.prototype.setFullYear = (function() {
			var setFullYear = Date.prototype.setFullYear;
			return function(fullYear) {
				setFullYear.call(this, fullYear);
				return this;
			}
		})();

		Date.prototype.setMonth = (function() {
			var setMonth = Date.prototype.setMonth;
			return function(month) {
				setMonth.call(this, month);
				return this;
			}
		})();

		Date.prototype.setDate = (function() {
			var setDate = Date.prototype.setDate;
			return function(date) {
				setDate.call(this, date);
				return this;
			}
		})();

		Date.prototype.setHours = (function() {
			var setHours = Date.prototype.setHours;
			return function(hours) {
				setHours.call(this, hours);
				return this;
			}
		})();

		Date.prototype.setMinutes = (function() {
			var setMinutes = Date.prototype.setMinutes;
			return function(minutes) {
				setMinutes.call(this, minutes);
				return this;
			}
		})();

		Date.prototype.setSeconds = (function() {
			var setSeconds = Date.prototype.setSeconds;
			return function(seconds) {
				setSeconds.call(this, seconds);
				return this;
			}
		})();

		Date.prototype.setMilliseconds = (function() {
			var setMilliseconds = Date.prototype.setMilliseconds;
			return function(milliseconds) {
				setMilliseconds.call(this, milliseconds);
				return this;
			}
		})();

		Date.prototype.setUTCFullYear = (function() {
			var setUTCFullYear = Date.prototype.setUTCFullYear;
			return function(fullYear) {
				setUTCFullYear.call(this, fullYear);
				return this;
			}
		})();

		Date.prototype.setUTCMonth = (function() {
			var setUTCMonth = Date.prototype.setUTCMonth;
			return function(month) {
				setUTCMonth.call(this, month);
				return this;
			}
		})();

		Date.prototype.setUTCDate = (function() {
			var setUTCDate = Date.prototype.setUTCDate;
			return function(date) {
				setUTCDate.call(this, date);
				return this;
			}
		})();

		Date.prototype.setUTCHours = (function() {
			var setUTCHours = Date.prototype.setUTCHours;
			return function(hours) {
				setUTCHours.call(this, hours);
				return this;
			}
		})();

		Date.prototype.setUTCMinutes = (function() {
			var setUTCMinutes = Date.prototype.setUTCMinutes;
			return function(minutes) {
				setUTCMinutes.call(this, minutes);
				return this;
			}
		})();

		Date.prototype.setUTCSeconds = (function() {
			var setUTCSeconds = Date.prototype.setUTCSeconds;
			return function(seconds) {
				setUTCSeconds.call(this, seconds);
				return this;
			}
		})();

		Date.prototype.setUTCMilliseconds = (function() {
			var setUTCMilliseconds = Date.prototype.setUTCMilliseconds;
			return function(milliseconds) {
				setUTCMilliseconds.call(this, milliseconds);
				return this;
			}
		})();
	},
	dateFormat: function() {
		Date.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		Date.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		Date.prototype.format = function(format) {
			var d = new Date();
			return format.replace(/Y/g, d.getFullYear())
				.replace(/y/g, d.getFullYear().toString().slice(-2))
				.replace(/M+/g, function(match) { return match.length === 1 ? Date.months[d.getMonth()].slice(0, 3) : Date.months[d.getMonth()]; })
				.replace(/m+/g, function(match) { return match.length === 1 ? d.getMonth() : ('0' + d.getMonth()).slice(-2); })
				.replace(/W+/g, function(match) { return match.length === 1 ? Date.days[d.getDay() - 1].slice(0, 3) : Date.days[d.getDay() - 1]; })
				.replace(/D+/g, function(match) { return match.length === 1 ? d.getDate() : ('0' + d.getDate()).slice(-2); });
		}

		Date.prototype.formatUTC = function(format) {
			var d = new Date();
			return format.replace(/Y/g, d.getUTCFullYear())
				.replace(/y/g, d.getUTCFullYear().toString().slice(-2))
				.replace(/M+/g, function(match) { return match.length === 1 ? Date.months[d.getUTCMonth()].slice(0, 3) : Date.months[d.getUTCMonth()]; })
				.replace(/m+/g, function(match) { return match.length === 1 ? d.getUTCMonth() : ('0' + d.getUTCMonth()).slice(-2); })
				.replace(/W+/g, function(match) { return match.length === 1 ? Date.days[d.getUTCDay() - 1].slice(0, 3) : Date.days[d.getUTCDay() - 1]; })
				.replace(/D+/g, function(match) { return match.length === 1 ? d.getUTCDate() : ('0' + d.getUTCDate()).slice(-2); });
		}
	},
	dateStarts: function() {
		Date.thisYearStartUTC = function() {
			return +new Date().setUTCMonth(0).setUTCDate(0).setUTCHours(0).setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.thisMonthStartUTC = function() {
			return +new Date().setUTCDate(0).setUTCHours(0).setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.yesterdayStartUTC = Date.previousDayStartUTC = function() {
			return +new Date().setUTCDate(new Date().getUTCDate() - 1).setUTCHours(0).setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.todayStartUTC = Date.thisDayStartUTC = function() {
			return +new Date().setUTCHours(0).setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.tomorrowStartUTC = Date.nextDayStartUTC = function() {
			return +new Date().setUTCDate(new Date().getUTCDate() - 1).setUTCHours(0).setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.thisHourStartUTC = function() {
			return +new Date().setUTCMinutes(0).setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.thisMinuteStartUTC = function() {
			return +new Date().setUTCSeconds(0).setUTCMilliseconds(0);
		}
		Date.thisSecondStartUTC = function() {
			return +new Date().setUTCMilliseconds(0);
		}
		Date.thisYearStart = function() {
			return +new Date().setMonth(0).setDate(0).setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.thisMonthStart = function() {
			return +new Date().setDate(0).setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.yesterdayStart = Date.previousDayStart = function() {
			return +new Date().setDate(new Date().getDate() - 1).setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.todayStart = Date.thisDayStart = function() {
			return +new Date().setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.tomorrowStart = Date.nextDayStart = function() {
			return +new Date().setDate(new Date().getDate() + 1).setHours(0).setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.thisHourStart = function() {
			return +new Date().setMinutes(0).setSeconds(0).setMilliseconds(0);
		}
		Date.thisMinuteStart = function() {
			return +new Date().setSeconds(0).setMilliseconds(0);
		}
		Date.thisSecondStart = function() {
			return +new Date().setMilliseconds(0);
		}
	},
	timing: function(object) {
		object.time = function(func, times) {
			times = times || 10;
			var ttimes = times;
			var date = new Date();
			while (ttimes--)
				func();
			return (new Date() - date) / 1000 / times;
		}

		object.timing = function(func, times) {
			times = times || 10;
			var ttimes = times - 1;
			var date = new Date();
			while (ttimes--)
				func();
			var result = func();
			return [(new Date() - date) / 1000 / times, result];
		}
	}
}

stdlib.arithmetic = function(window) {
Math.GCD = Math.HCF = function(a, b) {
	while (b)
		[a, b] = [b, a['%'](b)];
	return a;
}

Math.LCM = function(a, b) {
	return a / Math.HCF(a, b)['*'](b);
}

window.Complex = function(re, im) {
	if (arguments.length === 1 && typeof re === 'string') {
		var parts = real.split(/\+|(?=-)/).map(function(_) { return _.trim(); });
		this.im = 0;
		this.re = 0;
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (/i/.test(part))
				this.im += part === 'i' ? 1 : part === '-i' ? -1 : parseFloat(part.replace(/i/, ''));
			else
				this.re += parseFloat(part);
		}
		return this;
	}
	this.re = re || 0;
	this.im = im || 0;
	return this;
}

Complex.prototype.modulus = function() {
	return Math.sqrt(this.re * this.re + this.im * this.im);
}

Complex.prototype.argument = function() {
	return Math.atan(this.im / this.re);
}

Complex.prototype.conjugate = function() {
	return new Complex(this.re, -this.im);
}

Complex.prototype.isComplexInfinity = function() {
	return true;
}

function Quarternion(one, i, j, k) {
	if (arguments.length === 1 && typeof one === 'string') {
		var parts = one.split(/\+|(?=-)/).map(function(_) { return _.trim(); });
		this.one = 0;
		this.i = 0;
		this.j = 0;
		this.k = 0;
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (/i/.test(part))
				this.i += part === 'i' ? 1 : part === '-i' ? -1 : parseFloat(part.replace(/i/, ''));
			else if (/j/.test(part))
				this.j += part === 'j' ? 1 : part === '-j' ? -1 : parseFloat(part.replace(/j/, ''));
			else if (/k/.test(part))
				this.k += part === 'k' ? 1 : part === '-k' ? -1 : parseFloat(part.replace(/k/, ''));
			else
				this.one += parseFloat(part);
		}
		return this;
	}
	this.one = one || 0;
	this.i = i || 0;
	this.j = j || 0;
	this.k = k || 0;
	return this;
}

Quarternion.prototype.magnitude = function() {
	return Math.sqrt(this.one * this.one + this.i * this.i + this.j * this.j + this.k * this.k);
}

function sum(argument, maximum, initial) {
	var result = 0;
	initial = initial || 0;
	if (typeof argument === 'function')
		for (var i = initial; i < maximum; i++)
			result += argument(i);
	else if (argument instanceof _nativeArray)
		for (var i = initial; i < argument.length; i++)
			result += argument[i];
	return result;
}

function product(argument, maximum) {
	var result = 1;
	initial = initial || 0;
	if (typeof argument === 'function')
		for (var i = initial; i < maximum; i++)
			result *= argument(i);
	else if (argument instanceof _nativeArray)
		for (var i = initial; i < argument.length; i++)
			result *= argument[i];
	return result;
}

var BASE_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

window.baseArray = function(number, base) {
	var result = [],
		mayBeBig = parseInt(base.valueOf()) > _nativeNumber.MAX_SAFE_INTEGER;
	while (number.isNotZero()) {
		var mod = number['%'](base);
		result.unshift((mayBeBig && mod instanceof Big) ? parseInt(mod.valueOf()) : mod);
		number = number['/'](base).floor();
	}
	return result;
}

window.baseString = function(number, base) {
	var result = [],
		mayBeBig = parseInt(base.valueOf()) > _nativeNumber.MAX_SAFE_INTEGER;
	while (number.isNotZero()) {
		var mod = number['%'](base);
		result.unshift(BASE_DIGITS[(mayBeBig && mod instanceof Big) ? parseInt(mod.valueOf()) : mod]);
		number = number['/'](base).floor();
	}
	return result.join('');
}

window.baseToDecimal = function(object, base) {
	var result = 0;
	if (object instanceof _nativeArray) {
		for (var i = object.length - 1; i >= 0; i--)
			result = result['*'](base)['+'](object[i]);
	} else if (typeof object === 'string') {
		object = object.toLowerCase();
		for (var i = object.length - 1; i >= 0; i--)
			result = result['*'](base)['+'](BASE_DIGITS.indexOf(object[i])||BASE_DIGITS.indexOf(object[i]));
	}
	return result;
}

_nativeNumber.prototype.plus = function(other) {
	if ((this + other).needsPromotion())
		return new Big(this).times(new Big(other));
	return this + other;
}

_nativeNumber.prototype.minus = function(other) {
	return this - other;
}

_nativeNumber.prototype.times = function(other) {
	if ((this * other).needsPromotion())
		return new Big(this).times(new Big(other));
	return this * other;
}

_nativeNumber.prototype.divide = function(other) {
	return this / other;
}

Complex.prototype.plus = function(other) {
	if (typeof other === 'number')
		return new Complex(this.re + other, this.im);
	return new Complex(this.re + other.re, this.im + other.im);
}

Complex.prototype.minus = function(other) {
	if (typeof other === 'number')
		return new Complex(this.re - other, this.im);
	return new Complex(this.re - other.re, this.im - other.im);
}

Complex.prototype.times = function(other) {
	if (typeof other === 'number')
		return new Complex(this.re * other, this.im * other);
	return new Complex(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re);
}

Complex.prototype.divide = function(other) {
	if (typeof other === 'number')
		return new Complex(this.re / other, this.im / other);
	return this.times(other.conjugate()).divide(other.re * other.re + other.im * other.im);
}

Quarternion.prototype.plus = function(other) {
	if (typeof other === 'number')
		return new Quarternion(this.one + other, this.i, this.j, this.k);
	return new Quarternion(this.one + other.one, this.i + other.i, this.j + other.j, this.k + other.k);
}

Quarternion.prototype.minus = function(other) {
	if (typeof other === 'number')
		return new Quarternion(this.one - other, this.i, this.j, this.k);
	return new Quarternion(this.one - other.one, this.i - other.i, this.j - other.j, this.k - other.k);
}

Quarternion.prototype.times = function(other) {
	if (typeof other === 'number')
		return new Quarternion(this.one * other, this.i * other, this.j * other, this.k * other);
	return new Quarternion(this.one * other.one - this.i * other.i - this.j * other.j - this.k * other.k,
		this.j * other.k - this.k * other.j,
		this.k * other.i - this.i * other.k,
		this.i * other.j - this.j * other.i);
}

Big.prototype.mod = (function() {
	var mod = Big.prototype.mod;
	return function(base) {
		if (base instanceof Big)
			return mod.call(this, base);
		return parseInt(mod.call(this, base).valueOf());
	}
})();

Big.prototype.modulo = Big.prototype.mod;
Big.prototype.divide = Big.prototype.div;

_nativeNumber.prototype.floor = function() { return Math.floor(this); }
_nativeNumber.prototype.ceil = function() { return Math.ceil(this); }
_nativeNumber.prototype.isNotZero = function() { return this !== 0; }
_nativeNumber.prototype.isNegative = function() { return this < 0; }
Big.prototype.isNotZero = function() { return this.c.length !== 1 || this.c[0]; }
Big.prototype.floor = function() { return this.round(0, 0); }
Big.prototype.ceil = function() { return this.round(0, 4); }
Big.prototype.isNegative = function() { return this.s === -1; }
//TODO:lessthan?

_nativeNumber.prototype.gt = function(other) {
	if (other instanceof Big)
		return other.lte(this);
	return this > other;
}

_nativeNumber.prototype.gte = function(other) {
	if (other instanceof Big)
		return other.lt(this);
	return this >= other;
}

_nativeNumber.prototype.lt = function(other) {
	if (other instanceof Big)
		return other.gte(this);
	return this < other;
}

_nativeNumber.prototype.lte = function(other) {
	if (other instanceof Big)
		return other.gt(this);
	return this <= other;
}

_nativeNumber.prototype.abs = function() { return this < 0 ? - this : this; }
Big.prototype.abs = function() {
	var result = new Big(this);
	result.s = 1;
	return result;
}

//TODO: cache - realistic limits/params?
_nativeNumber.prototype.factorial = Big.prototype.factorial = function() {
	if (!this.isNotZero())
		return 1;
	var result = this,
		current = this;
	if (this.modulo(1).isNotZero())
		return NaN;
	while ((current = current['-'](1)).isNotZero())
		result = result['*'](current);
	return result;
}

_nativeNumber.prototype['+'] = _nativeNumber.prototype.plus;
_nativeNumber.prototype['-'] = _nativeNumber.prototype.minus;
_nativeNumber.prototype['*'] = _nativeNumber.prototype.times;
_nativeNumber.prototype['/'] = _nativeNumber.prototype.divide;
_nativeNumber.prototype['%'] = _nativeNumber.prototype.modulo;
_nativeNumber.prototype['!'] = _nativeNumber.prototype.factorial;
Complex.prototype['+'] = Complex.prototype.plus;
Complex.prototype['-'] = Complex.prototype.minus;
Complex.prototype['*'] = Complex.prototype.times;
Complex.prototype['/'] = Complex.prototype.divide;
Quarternion.prototype['+'] = Quarternion.prototype.plus;
Quarternion.prototype['-'] = Quarternion.prototype.minus;
Quarternion.prototype['*'] = Quarternion.prototype.times;
Big.prototype['+'] = Big.prototype.plus;
Big.prototype['-'] = Big.prototype.minus;
Big.prototype['*'] = Big.prototype.times;
Big.prototype['/'] = Big.prototype.divide;
Big.prototype['%'] = Big.prototype.modulo;
Big.prototype['!'] = Big.prototype.factorial;

Math.pow = (function() {
	var pow = Math.pow;
	return function(base, power) {
		if (power === 2)
			return base['*'](base);
		if (power % 1)
			return pow(base, power); //no choice atm D:
		var result = pow(base, power);
		if (result.needsPromotion())
			return new Big(base).pow(power);
		return result;
	}
})();

Math.sqrt = (function() { //TODO: accept complex _nativeNumber as arg
	var sqrt = Math.sqrt;
	return function(_nativeNumber) {
		if (_nativeNumber >= 0)
			return sqrt(_nativeNumber);
		return new Complex(0, sqrt(-_nativeNumber));
	}
})();

Math.abs = function(_nativeNumber) {
	return _nativeNumber.abs();
}

_nativeString.prototype['='] = _nativeString.prototype.eq = _nativeString.prototype.equals = function(other) {
	return this === other;
}

_nativeNumber.prototype['='] = _nativeNumber.prototype.eq = _nativeNumber.prototype.equals = function(other) {
	return this === other || (other instanceof Big && other.eq(this));
}

_nativeArray.prototype['='] = _nativeArray.prototype.eq = _nativeArray.prototype.equals = function(other) {
	return this.every(function(item, i) { return item.eq(other[i]); });
}

_nativeArray.prototype['/'] = function(number) {
	return this.map(function(item, i) {
		return item['/'](number);
	});
}
}

stdlib.init = function(window) {
	for (var key in stdlib)
		if (stdlib.hasOwnProperty(key) && key !== 'init' && typeof stdlib[key] === 'function')
			stdlib[key](window);
}