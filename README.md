# ![Imgur](http://i.imgur.com/FHjshUv.png)

Jinx is an AS3 API, that make AS3 simpler and easy-to-use. Inspired on jQuery. 

Jinx is [NPM](https://www.npmjs.com) friendly , for publish and load Jinxs packages (.as and .swc)

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

## Getting Started

The best way is cloning this repo and use the test folder as workspace. We don't have any boilerplate yet.
```
git clone https://github.com/webcaetano/jinx.git
cd jinx
npm install
```

Start the development mode.
```
gulp serve
```

Create the .swf 
```
gulp

# or 

gulp build
```


## Documentation

- [console.log](#consolelog)

- Events
  - [$click](#click)
  - [$hover](#hover)
  - [$enterFrame](#enterframe)



### console.log
Works like trace but output in the browser console. See [Print](http://i.imgur.com/bE0TzzL.png).
Debug everything in a browser.
```javascript
console.log('Hello World'); // output Hello World
```

### $click
Click Event, alias for mc.$bind('click',[Function]).
```javascript
myMc.name = 'Lulu';

myMc.$click(function(){
	console.log(this.name); // lulu;
}); // click event
```

### $hover
Mouse hover event, alias for mc.$bind('hover',[Function]).
```javascript
myMc.$hover(function(){
	console.log('mouse hover');
});

// or

myMc.$hover(function(){
	console.log('mouse hover');
},function(){
	console.log('mouse out');
});
```

### $enterFrame
EnterFrame Event, alias for mc.$bind('enterFrame',[Function]).
```javascript
myMc.$enterFrame(function(){
	this.rotation += 0.5; // it will spin;
});
```


## Project Road : 

- [x] Create Repo
- [x] Create test environment in GulpJS using [gulp-flash](https://github.com/webcaetano/gulp-flash)
- [x] Add to [NPM](https://www.npmjs.com)
- [x] Make one Jinx Package ([jinx-mempanel](https://github.com/webcaetano/jinx-mempanel))
- [x] Load one Jinx Package via [NPM](https://www.npmjs.com)
- [x] Create a [jinx packages loader](https://github.com/webcaetano/jinx-loader) 
- [x] Create a [gulp-jinx-inject](https://github.com/webcaetano/gulp-jinx-inject)
- [ ] Create Documentation [-         ] 5%
- [ ] Merge all non-prototype functions in one Object ($ and jinx)
- [ ] Make a gh-page with Examples
- [ ] Dependencies of Dependencies
- [ ] Create API for load AS Plugins and SWC from [NPM](https://www.npmjs.com)

Any ideias? Issues? Have some improvement? Please help us, and make part of this API. :+1:


---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)
