'use strict';

$(document).ready(function(){
	var cacheScape = (+ new Date().getTime())+Math.floor(Math.random()*10000);
	$('#flash-player').flash({
		swf: 'app/flash/dist/init.swf?c='+cacheScape,
		height: 400,
		width: 600,
		allowFullScreen: true,
		// wmode: 'transparent',
		flashvars: {}
	});
});
