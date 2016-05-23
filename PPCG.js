'use strict';

var PPCG  = function(window) {
	//from http://www.javascripter.net/faq/numberisprime.htm
	function trialFactor(n) {
		var r = 0, j = -1, i = Array.from(arguments).slice(1);
		while (r === 0 && ++j < i.length)
			r = n % i[j] === 0 ? i[j] : 0;
		return r;
	}

	function smallestFactor(n){
		if (isNaN(n) || !isFinite(n))
			return NaN;  
		if (n==0)
			return 0;
		if (n % 1 || n * n < 2)
			return 1;
		let r;
		if (r = trialFactor(n, 2, 3, 5))
			return r; 
		var m = Math.sqrt(n);
		for (var i = 7; i <= m; i += 30)
			if (r = trialFactor(n, i, i + 4, i + 6, i + 10, i + 12, i + 16, i + 22, i + 24))
				return r;
		return n;
	}

	window.H = 'Hello, World!';
	window.T = function(_) { while (_) { console.log(_); } }
	window.P = function(n) { return n === smallestFactor(n); }
	Array.prototype.J = function(char) {
		return this.join(char || ' ');
	}
	Array.prototype.__defineGetter__('j', function() { return this.join(' '); });
	Array.prototype.S = function(char) {
		return this.split(char || ' ');
	}
	Array.prototype.__defineGetter__('s', function() { return this.split(' '); });
	window.A = function(object, length) {
		return new Array(times).fill(object);
	}
	window.a = function(object, times) {
		var originalLength = this.length,
			length = Math.round(this.length * times),
			self = this;
		return new _nativeArray(length).fill().map(function(_,i) { return self[i % originalLength]; });
	}
	Object.getOwnPropertyNames(Math).forEach(function(key) {
		if (/atan|asin|acos/.test(key))
			window[key] = function(side) { return Math[key](side) * 180 / PI; }
		else if (/tan|sin|cos/.test(key))
			window[key] = function(angle) { return Math[key](angle / 180 * PI); }
		else
			window[key] = Math[key];
	});
}