var Tests = {
	uilib: {
		ace: function() {
			//TODO: unique id
			var d = (+new Date()).toString().slice(-5),
				w = new Window('<div id="ace-' + d + '" style="flex: 1 0 auto;"></div>', {chrome: true, title: 'Ace Code Editor'}),
				editor = ace.edit('ace-' + d);
			editor.setTheme('ace/theme/twilight');
			editor.session.setMode('ace/mode/javascript');
		},
		mce: function() {
			var d = (+new Date()).toString().slice(-5),
				w = new Window('<div id="mce-' + d + '"></div>', {chrome: true, title: 'TinyMCE', resizable: false, height: 1, width: 1}); //TODO: resizable
			tinymce.init({selector: '#mce-' + d});
		}/*,
		browser: function() {
			var d = (+new Date()).toString().slice(-5), //TODO: IIFE
				backSVG = '\
<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
    <path d="M0 0h24v24H0z" fill="none"/>\
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="rgba(0, 0, 0, 0.5)"/>\
</svg>',
				nextSVG = '\
<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
    <path d="M0 0h24v24H0z" fill="none"/>\
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="rgba(0, 0, 0, 0.5)"/>\
</svg>',
				reloadSVG = '\
<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="rgba(0, 0, 0, 0.5)"/>\
    <path d="M0 0h24v24H0z" fill="none"/>\
</svg>',
				cancelSVG = '\
<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>\
    <path d="M0 0h24v24H0z" fill="none"/>\
</svg>',
				back = $c('div').css({flex: '0 1 auto'}),
				next = $c('div').css({flex: '0 1 auto'}),
				reload = $c('div').css({flex: '0 1 auto'}),
				addressBar = $c('div').css({display: 'flex', flex: '0 1 auto', background: '#EFEFEF'}),
				iframe = $c('iframe').css({flex: '1 0 auto', border: '1px solid #BBB'}),
				chromium = $c('div').css({display: 'flex', flex: '1 0 auto', flexFlow: 'column'}),
				hoverCSS = {
					//
				}
				self = this;
			iframe.src = 'http://google.com';
			back.innerHTML = backSVG;
			next.innerHTML = nextSVG;
			reload.innerHTML = reloadSVG;
			addressBar.appendChildren(back, next, reload);
			chromium.appendChildren(addressBar, iframe);
			iframe.onload = function() { //TODO: does this fire multiple times?
				reload.innerHTML = reloadSVG;
				this.contentWindow.onunload = function() {
					reload.innerHTML = cancelSVG;
				}
			}
			// icons: back next refresh
			var w = new Window(chromium, {
				chrome: true,
				title: 'Chromium.js'
				//only if (!config.useChromeTitleBar)
				buttonsOnRight: true,
				buttonCSS: {
					height: 18,
					width: 24,
					borderRadius: 1,
					border: 'rgba(0, 0, 0, 0.17)'
				},
				//buttonHoverCSS
				closeButtonCSS: {
					borderTopRightRadius: 3
				}
			});
		}*/
	}
}

Tests.uilib.all = function() {
	Tests.uilib.ace();
	Tests.uilib.mce();
	Tests.uilib.browser();
}