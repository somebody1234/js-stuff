'use strict';

function FizzBuzz(numbers, config) {
	if (numbers && numbers instanceof Array)
		config = config;
	else {
		config = numbers;
		numbers = [3, 5];
	}
	if (!config)
		config = {};
	if (!config.words) 
		config.words = config.w || {3:'Fizz', 5:'Buzz'};
	if (!config.max_repeats)
		config.max_repeats = config.m || 1;
	return function(start, end) {
		var lines = [];
		if (end === undefined)
			end = start + 1;
		for (var i = start; i <= end; i++) {
			var string = '';
			for (var key in config.words) {
				if (!config.words.hasOwnProperty(key))
					continue;
				var divisor = parseInt(key),
					n = i,
					depth = 0;
				while (n % divisor === 0 && depth < config.max_repeats) {
					string += config.words[key];
					n = Math.floor(n / divisor);
					depth++;
				}
				for (var j = 0; j < (config.transforms || '').length; j++)
					string = config.transforms[j](string, i);
			}
			string = string ? string : i;
			lines.push(string.toString());
		}
		return lines;
	}
}

var Fz = FizzBuzz;