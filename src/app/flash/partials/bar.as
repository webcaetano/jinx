var myMc = new foo();
addChild(myMc);

myMc.x=250;
myMc.y=200;

myMc.$hover(function(){
	this.alpha=0.5;
},function(){
	this.alpha=1;
});

myMc.$enterFrame(function(){
	this.rotation += 2;
});
