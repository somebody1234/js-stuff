var $console,
	t = document.createTextNode.bind(document);

Node.prototype.css = function(css) {
	for (var key in css) {
		if (!css.hasOwnProperty(key))
			continue;
		this.style[key] = css[key];
	}
}

function init(console) {
	$console = console;
}

function print(text) {
	if (text instanceof Array)
		for (var i = 0; i < text.length; i++) {
			var item = text[i];
			if (item instanceof Array)
				$console.appendChild(t(item[0]).css({color: item[1]}));
			else
				$console.appendChild(t(text));
		}
	else
		$console.appendChild(t(text));
}