# Jinx

Jinx is an AS3 API, that make AS3 simpler and easy-to-use. 
Inspired on jQuery.

Example :
```javascript
// as3 vanilla
myButton.addEventListener(MouseEvent.CLICK, myClickReaction);

function myClickReaction (e:MouseEvent):void{
	trace("Clicked!");
}

// jinx
myButton.$click(function(){
	trace("Clicked!");
});
```

Chaning Functions Example:
```javascript
// as3 vanilla
myMc.addEventListener(Event.ENTER_FRAME, function(e:Event){
	e.target.x += 0.5;
});

myMc.addEventListener(MouseEvent.MOUSE_OVER, function(e:Event){
	trace("Hover!");
});

myMc.gotoAndStop(3);
myMc.visible = true;

// jinx
myMc.$enterFrame(function(){
	this.x += 0.5;
}).$hover(function(){
	trace("Hover!");
}).$gotoAndStop(3).$show();

```

### Project Road : 

- [x] Create Repo
- [x] Create test environment in GulpJS
- [ ] Add to NPM
- [ ] Create Documentation
- [ ] Make Examples
- [ ] Finish to prototype functions

Any ideias? Issues? Please help us. And make part of this API. :+1:

---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)
