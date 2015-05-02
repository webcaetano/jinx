var tmpObj = new foo();
addChild(tmpObj);

tmpObj.x=250;
tmpObj.y=200;

tmpObj.$click(function(){
	this.$hide();
})


