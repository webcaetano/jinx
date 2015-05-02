# Jinx

Jinx is an AS3 API, that make AS3 simpler and easy-to-use. 
Inspired on jQuery.

Example :
```javascript
// as3 vanilla
myButton.addEventListener(MouseEvent.CLICK, myClickReaction);

function myClickReaction (e:MouseEvent):void{
	trace("I was clicked!");
}

// jinx
myButton.$click(function(){
	trace("I was clicked!");
});
```

### Project Road : 

- [x] Create Repo
- [x] Create test environment in GulpJS
- [ ] Add to NPM
- [ ] Create Documentation
- [ ] Make Examples
- [ ] Finish to prototype functions

---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)
