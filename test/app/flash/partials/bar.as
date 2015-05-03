var tmpObj = new foo();
addChild(tmpObj);

tmpObj.x=250;
tmpObj.y=200;

// tmpObj.$click(function(){
// 	this.$hide();
// })

tmpObj.$hover(function(){
	this.$tint($randomIndex(['FF00FF','00FFFF','00FF00','FFFF00','0000FF','FF0000']),100,10);
},function(){
	this.$tint('FFFFFF');
})
// .$scale(50);
// .$followMouse();

