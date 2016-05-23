function Brainfuck(input, size, max) {
	if (max > Number.MAX_SAFE_INTEGER)
		return new BigIntBrainfuck(input, size, max);
	this.size = size;
	this.max = max;
	var sanitized = ShortenBrainfuck(input, 7),
		parsed = [],
		stacktrace = [],
		result,
		i, text, ltcount, gtcount;
	while (sanitized) {
		if (result = collapseValueChanges(sanitized)) {
			sanitized = result[0];
			parsed.push(result[1]);
		} else if (result = collapseCellChanges(sanitized)) {
			sanitized = result[0];
			parsed.push(result[1]);
		} else if (match = /^\[([^\[]]*)\]/.exec(sanitized)) {
			text = match[1];
			ltcount = gtcount = 0;
			for (i = 0; i < text.length; i++)
				switch (text[i]) {
					case '<':
						ltcount++;
						break;
					case '>':
						gtcount++;
						break;
				}
			if (ltcount === gtcount) {
				loop = [];
				while (text)
					if (result = collapseValueChanges(text)) {
						text = result[0];
						loop.push(result[1]);
					} else if (result = collapseCellChanges(text)) {
						text = result[0];
						loop.push(result[1]);
					}
				for (i = 0; i < loop.length; i++) {
					//TODO: +=
				}
				//do stuff to loop
			}
		}
	}
}

Brainfuck.prototype.calculateIndex = function() { this.index = this.index['%'](this.size);}
Brainfuck.prototype['+'] = function(n) { this.calculateIndex(); this[this.index] += n; }
Brainfuck.prototype['-'] = function(n) { this.calculateIndex(); this[this.index] -= n; }
Brainfuck.prototype['<'] = function(n) { this.index += n; }
Brainfuck.prototype['>'] = function(n) { this.index -= n; }
Brainfuck.prototype.getter = function(i) { return function() { return this[i]; } }

Brainfuck.collapseValueChanges = function(sanitized) {
	var match;
	if (match = /^[+-]/.exec(sanitized)) {
		var n = 0;
		for (var i = 0; i < match.length; i++)
			n += match[i] === '+' ? 1 : -1;
		sanitized = sanitized.slice(match.length);
		if (n)
			return [sanitized, n > 0 ? ['+', n] : ['-', -n]];
	}
}

Brainfuck.collapseCellChanges = function(sanitized) {
	var match;
	if (match = /^[<>]/.exec(sanitized)) {
		var n = 0;
		for (var i = 0; i < match.length; i++)
			n += match[i] === '>' ? 1 : -1;
		sanitized = sanitized.slice(match.length);
		if (n)
			return [sanitized, n > 0 ? ['>', n] : ['<', -n]];
	}
}

function BrainfuckCompiler(code) {
	//
}

BrainfuckCompiler.prototype.variables = {
	current: function() { return ''; },
	this: function() { return ''; },
	self: function() { return ''; } //0 offset
	//TODO: optimize
}

function ShortenBrainfuck(code, config) {
	var level = 0;
	if (typeof config === 'number') {
		level = config;
		config = {};
	} else {
		config = config || {};
	}
	if (level || config.sanitize !== false || config.s !== false)
		code = code.replace(/[^\+\-<>\.,\[\]]/g, '');
	if (level > 1 || config.removeEmptyLoops !== false || config.r !== false)
		while (/\[\]/.test(code))
			code = code.replace(/\[\]/g, '');
	if (level === 2 || level > 3 || config.removeEmptyLoops !== false || config.r !== false) {
		while (/\+-|-\+|<>|></.test(code))
			code = code.replace(/\+-|-\+|<>|></g, '');
	}
	//TODO: remove double brackets
}