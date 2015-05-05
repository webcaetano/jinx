var myMc = new foo();
addChild(myMc);

myMc.x=250;
myMc.y=200;

myMc.$hover(function(){
	this.$tint($randomIndex(['FF00FF','00FFFF','00FF00','FFFF00','0000FF','FF0000']),100,10);
},function(){
	this.$tint('FFFFFF');
});

myMc.$enterFrame(function(){
	this.rotation += 2;
});
