'use strict';

var $c = document.createElement.bind(document),
	windows = [], //TODO: fullscreen
	zIndex = 0,
	defaultTheme = {
		boxShadow: '0px 0px 15px #888',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		background: '#546E7A'
	},
	defaultConfig = {
		buttons: ['close', 'minimize', 'restore'],
		buttonCSS: {
			width: 14,
			height: 14,
			borderRadius: '100%',
			fontFamily: 'monospace',
			fontWeight: 'bold',
			background: '#DBDEE0',
			color: '#9A9C9D',
			margin: 3
		},
		buttonHoverCSS: {
			background: '#FFF',
			color: '#B3B3B3'
		},
		buttonUnhoverCSS: {
			background: '#DBDEE0',
			color: '#9A9C9D'
		},
		titleCSS: {
			fontFamily: 'sans-serif',
			fontSize: 14,
			fontWeight: 'bold',
			color: '#CADEE0'
		}
	};

Node.prototype.appendChildren = function() {
	for (var i = 0; i < arguments.length; i++)
		this.appendChild(arguments[i]);
}

String.prototype.center = function() {
	return '<center>' + this + '</center>';
}

var shrink = '0 1 auto',
	grow = '1 0 auto';

function Window($content, config) {
	config = config || {};
	this.dragging = '';
	var self = this;
	if (typeof $content === 'string') {
		var div = $c('div').css({display: 'flex', flex: '1 0 auto'});
		div.innerHTML = $content;
		$content = div;
	}
	this.content = $c('div');
	this.window = this.content;
	if (config.chrome) {
		this.chrome = $c('div').css({left: 0, top: 0, width: config.width || 640, height: config.height || 480, display: 'flex', flexFlow: 'column', position: 'absolute'});
		var top = $c('div').css({flex: shrink, display: 'flex', height: 15}),
			middle = $c('div').css({flex: grow, display: 'flex'}),
			bottom = $c('div').css({flex: shrink, display: 'flex', height: 15}),
			topLeft = $c('div').css({cursor: 'nw-resize', flex: shrink, width: 15}),
			topMid = $c('div').css({cursor: 'n-resize', flex: grow}),
			topRight = $c('div').css({cursor: 'ne-resize', flex: shrink, width: 15}),
			left = $c('div').css({cursor: 'w-resize', flex: shrink, width: 15}),
			main = $c('div').css({flex: grow}),
			right = $c('div').css({cursor: 'e-resize', flex: shrink, width: 15}),
			bottomLeft = $c('div').css({cursor: 'sw-resize', flex: shrink, width: 15}),
			bottomMid = $c('div').css({cursor: 's-resize', flex: grow}),
			bottomRight = $c('div').css({cursor: 'se-resize', flex: shrink, width: 15}),
			topbar = $c('div'),
			content = $c('div').css({display: 'flex'});
		this.window = main;
		top.appendChildren(topLeft, topMid, topRight);
		middle.appendChildren(left, main, right);
		bottom.appendChildren(bottomLeft, bottomMid, bottomRight);
		this.chrome.appendChildren(top, middle, bottom);
		main.css({display: 'flex', flexFlow: 'column'});
		topbar.css({flex: shrink, display: 'flex'});
		content.css({flex: grow, background: '#FFF'}); //TODO: configify
		content.appendChild($content);
		if (config.buttons !== false) {
			var buttons = $c('div');
			buttons.css({display: 'flex', flex: shrink, cursor: 'default'});
			topbar.appendChild(buttons);
			config.buttons = config.buttons || defaultConfig.buttons;
			for (var i = 0; i < config.buttons.length; i++) {
				var button = $c('div');
				button.onmouseenter = function() {
					this.css(config.buttonHoverCSS || defaultConfig.buttonHoverCSS);
				}
				button.onmouseleave = function() {
					this.css(config.buttonUnhoverCSS || defaultConfig.buttonUnhoverCSS);
				}
				button.css({flex: shrink});
				//TODO: ensure square
				button.css(defaultConfig.buttonCSS || {}).css(config.buttonCSS || {});
				switch (config.buttons[i]) {
					case 'close':
						button.css(defaultConfig.closeButtonCSS || {}).css(config.closeButtonCSS || {});
						button.innerHTML = '&#215;'.center();
						button.onclick = function() {
							self.chrome.parentElement.removeChild(self.chrome);
						}
						buttons.appendChild(button);
						break;
					case 'minimize':
					case 'minimise':
						button.css(defaultConfig.minimizeButtonCSS ||
								defaultConfig.minimiseButtonCSS ||
								{}
							).css(
								config.minimizeButtonCSS ||
								config.minimiseButtonCSS ||
								{}
							);
						button.innerHTML = '-'.center();
						//TODO: disable on webpages with no taskbar
						buttons.appendChild(button);
						break;
					case 'restore':
					case 'maximize':
					case 'maximise':
						button.css(defaultConfig.maximizeButtonCSS ||
								defaultConfig.maximiseButtonCSS ||
								defaultConfig.restoreButtonCSS ||
								{}
							).css(
								config.maximizeButtonCSS ||
								config.maximiseButtonCSS ||
								config.restoreButtonCSS ||
								{}
							);
						button.innerHTML = '+'.center();
						button.onclick = function() {
							if (self.window.style.top === '-15px' &&
								self.window.style.left === '-15px' &&
								self.window.style.width === '100vw' &&
								self.window.style.height === '100vh'
							) {
								this.innerHTML = '+'.center();
								self.window.css({
									top: self.window._css.top || 0,
									bottom: self.window._css.bottom || 0,
									width: self.window._css.width || 0,
									height: self.window._css.height || 0
								});
							} else {
								this.innerHTML = '&#8211;'.center();
								if (!self.window._css)
									self.window._css = {};
								var r = self.window.getBoundingClientRect();
								self.window._css.top = r.top;
								self.window._css.left = r.left;
								self.window._css.width = r.width;
								self.window._css.height = r.height;
								self.window.css({top: -15, left: -15, width: '100vw', height: '100vh'});
							} 
						}
						buttons.appendChild(button);
						break;
				}
			}
		}
		var title = $c('span').css(defaultConfig.titleCSS || {}).css(config.titleCSS || {});
		title.innerText = config.title || '';
		topbar.appendChild(title);
		main.appendChildren(topbar, content);
		this.chrome.onclick = function() { self.chrome.style.zIndex = zIndex++; }
		topbar.onmousedown = function() { self.dragging = 'topbar'; document.body.style.cursor = 'move'; }
		left.onmousedown = function() { self.dragging = 'left'; document.body.style.cursor = 'w-resize'; }
		right.onmousedown = function() { self.dragging = 'right'; document.body.style.cursor = 'e-resize'; }
		topMid.onmousedown = function() { self.dragging = 'topMid'; document.body.style.cursor = 'n-resize'; }
		bottomMid.onmousedown = function() { self.dragging = 'bottomMid'; document.body.style.cursor = 's-resize'; }
		topLeft.onmousedown = function() { self.dragging = 'topLeft'; document.body.style.cursor = 'nw-resize'; }
		topRight.onmousedown = function() { self.dragging = 'topRight'; document.body.style.cursor = 'ne-resize'; }
		bottomLeft.onmousedown = function() { self.dragging = 'bottomLeft'; document.body.style.cursor = 'sw-resize'; }
		bottomRight.onmousedown = function() { self.dragging = 'bottomRight'; document.body.style.cursor = 'se-resize'; }
		document.addEventListener('mouseup', function() {
			self.dragging = ''; document.body.style.cursor = 'default';
		});
		document.addEventListener('mousemove', function(e) { //TODO: store int versions
			if (!self.dragging)
				return;
			var s = self.chrome.style;
			switch (self.dragging) {
				case 'topbar':
					s.left = (parseInt(s.left) + e.movementX) + 'px';
					s.top = (parseInt(s.top) + e.movementY) + 'px';
					break;
				case 'left':
					self.chrome.css({left: e.clientX - 15, width: parseInt(s.width) - e.movementX});
					break;
				case 'right':
					self.chrome.css({width: e.clientX  - parseInt(s.left)});
					break;
				case 'topMid':
					self.chrome.css({top: e.clientY - 15, height: parseInt(s.height) - e.movementY});
					break;
				case 'bottomMid':
					self.chrome.css({height: e.clientY  - parseInt(s.top)});
					break;
				case 'topLeft':
					self.chrome.css({left: e.clientX - 15, width: parseInt(s.width) - e.movementX, top: e.clientY - 15, height: parseInt(s.height) - e.movementY});
					break;
				case 'topRight':
					self.chrome.css({width: e.clientX  - parseInt(s.left), top: e.clientY, height: parseInt(s.height) - e.movementY});
					break;
				case 'bottomLeft':
					self.chrome.css({left: e.clientX, width: parseInt(s.width) - e.movementX, height: e.clientY  - parseInt(s.top)});
					break;
				case 'bottomRight':
					self.chrome.css({width: e.clientX  - parseInt(s.left), height: e.clientY  - parseInt(s.top)});
					break;
			}
			e.preventDefault();
		});
	} else {
		this.window.onclick = function() { self.window.style.zIndex = zIndex++; }
	}
	windows.push(this); //TODO: z-index, currentZ
	this.window.css(defaultTheme).css(config.theme || {});
	(this.chrome || this.window).style.zIndex = zIndex++;
	document.body.appendChild(this.chrome || this.window);
}

function a(node) {
	for (var i = 1; i < arguments.length; i++)
		node.appendChild(arguments[i]);
}

function NodeArray(nodes) {
	this.nodes = nodes;
}

NodeArray.prototype.forEach = function(method) {
	if (typeof method === 'function')
		this.nodes.forEach(method);
	else if (arguments.length > 1)
		for (var i = 0; i < this.nodes.length; i++)
			this.nodes[i][method].apply(this.nodes[i], arguments.slice(1));
	else
		for (var i = 0; i < this.nodes.length; i++)
			this.nodes[i][method]();
	return this;
}


NodeArray.prototype.css = function(style) { return this.forEach('css', style); }
NodeArray.prototype.hide = function() { return this.forEach('hide'); }
NodeArray.prototype.show = function() { return this.forEach('show'); }
NodeArray.prototype.toggle = function() { return this.forEach('toggle'); }

Node.prototype.hide = function() {
	if (!this._css)
		this._css = {};
	if (!this._css.display)
		this._css.display = this.style.display;
	this.style.display = 'none';
	return this;
}

Node.prototype.show = function() {
	this.style.display = (this._css && this._css.display) ? this._css.display : '';
	return this;
}

Node.prototype.toggle = function() {
	if (!this.style.display || this.style.display === 'none')
		this.show();
	else
		this.hide();
	return this;
}

Node.prototype.html = function(html) {
	this.innerHTML = html;
	return this;
}

Node.prototype.text = function(text) {
	this.innerText = text;
	return this;
}

//TODO: add/remove/toggleClass = classList[name]
//hasclass = contains

Node.prototype.css = function(style) {
	for (var key in style) {
		if (!style.hasOwnProperty(key))
			continue;
		if (typeof style[key] === 'number')
			this.style[key] = style[key] + 'px'; //TODO: any exceptions?
		else
			this.style[key] = style[key];
	}
	if (style.zIndex)
		this.style.zIndex = style.zIndex;
	return this;
}

function Tabbar($el, tabs, config) {
	var tabArray;
	if (!tabs instanceof Array) {
		config = tabs;
		tabArray = new NodeArray([]);
	} else
		tabArray = new NodeArray(tabs);
	config = config || {};
	$el.display = 'flex';
	var tabbar = $c('div'),
		tabs = $c(config.mainType || 'ul');
	tabbar.style.flex = shrink;
	tabs.style.flex = grow;
	tabs.onclick = function(event) {
		tabArray.hide();
		event.path[event.path.indexOf(tabs) - 1].show();
	}
	for (var i = 0; i < tabArray.length; i++) {
		tabs.appendChild(tabArray[i]);
		tabbar.appendChild(/*new tab*/);
	}
	if (config.closable) {
		//add close button
	}
	if (config.addable) {
		//add newtab button
		var newtabButton = $c('div');
	}
	a(el, tabbar, tabs);
}

var Anchor = {
	TOP: 0,
	BOTTOM: 1,
	LEFT: 2,
	RIGHT: 3
}

function Toolbar($el, items, config) {
	config = config || {};
	var anchor = config.anchor || Anchor.TOP,
		toolbar = $el.css({display: 'flex', flex: shrink}),
		divs = [];
	if (anchor > 1)
		toolbar.style.flexFlow = 'column';
	for (var i = 0; i < items.length; i++) {
		var item = items[i],
			html = item[0],
			events = item[1];
		var div = $c('div').css({flex: shrink});
		console.log(item[0])
		if (typeof html === 'string')
			div.innerHTML = html;
		else
			div.appendChild(html);
		for (var key in events) {
			if (!events.hasOwnProperty(key))
				continue;
			div.children[0][key] = events[key];
		}
		divs.push(div);
		toolbar.appendChild(div);
	}
	this.toolbar = $el;
	this.items = divs;
}

function ToolbarButton(content /*image etc*/, onclick) {
	this.button = $c('button');
	this.button.innerHTML = content;
	this.button.onclick = onclick;
}

function ToolbarAfter($el) {
	//$el.appendafter???
}

function Draggable($el) {
	//
}

function Droppable($el) {
	//
}

function Sortable($el) {
	//data attribute, sort function
}
