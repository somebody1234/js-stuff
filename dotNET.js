// requres stdlib.js
//TODO: does ES5 have yield?
Array.prototype.Select = Array.prototype.map;
Array.prototype.Where = Array.prototype.where;

Array.prototype.__defineGetter__('Length', function() { return this.length; });

Array.prototype.Index = 0;
Array.prototype.__defineGetter__('Previous', function() { return this[this.Index - 1]; });
Array.prototype.__defineGetter__('Current', function() { return this[this.Index]; });
Array.prototype.__defineGetter__('Next', function() { return this[this.Index + 1]; });
Array.prototype.PeekBack = function() { return this[this.Index - 1]; }
Array.prototype.Peek = function() { return this[this.Index + 1]; }
Array.prototype.MoveNext = function() { this.Index++; }
Array.prototype.Skip = function(n) { n = n || 1; this.Index += n; return this; }
Array.prototype.Take = function(n) { n = n || 1; this.Index += n; console.log(this.Index); return this.slice(this.Index - n, this.Index); }
Array.prototype.SkipWhile = function(predicate) {
	var result = [];
	predicate = predicate || function(_) { return _; };
	for (;this.Index < this.length; this.Index++)
		if (predicate(this.Current, this.Index, this))
			result.push(this.Current);
		else
			break;
	return result;
}
Array.prototype.TakeWhile = function(predicate) {
	var result = [];
	predicate = predicate || function(_) { return _; };
	for (;this.Index < this.length; this.Index++)
		if (predicate(this.Current, this.Index, this))
			result.push(this.Current);
		else
			break;
	return result;
}

//TODO: .NET regex
RegExp.prototype.Match = RegExp.prototype.exec;
RegExp.prototype.isMatch = RegExp.prototype.test;