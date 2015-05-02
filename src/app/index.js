'use strict';

import './main';


$(document).ready(function(){
	$('#flash-player').flash({
		swf: 'app/flash/dist/main.swf?b='+Math.floor(Math.random()*10000),
		height: 400,
		width: 600,
		allowFullScreen: true,
		// wmode: 'transparent',
		flashvars: {}
	});
	console.log(Math.floor(Math.random()*10000))
});



