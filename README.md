# ![Imgur](http://i.imgur.com/FHjshUv.png)

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
- [x] Create test environment in GulpJS using [gulp-flash](https://github.com/webcaetano/gulp-flash)
- [x] Add to [NPM](https://www.npmjs.com)
- [x] Make one Jinx Package ([memPanel](https://github.com/webcaetano/jinx-mempanel))
- [x] Load one Jinx Package via [NPM](https://www.npmjs.com)
- [ ] Create a [GulpJS](http://gulpjs.com) plugin for autoload Jinx Packages
- [ ] Create Documentation
- [ ] Make a gh-page with Examples
- [ ] Create API for load AS Plugins and SWC from [NPM](https://www.npmjs.com)

Any ideias? Issues? Have some improvement? Please help us, and make part of this API. :+1:


---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)
