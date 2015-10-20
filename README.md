# ![Imgur](http://i.imgur.com/FHjshUv.png)

Jinx is an AS3 API, that make AS3 simpler and easy-to-use, but more powerfull with some new features.

Jinx is [NPM](https://www.npmjs.com) friendly , for publish and load Jinxs packages (.jinx, .as and .swc). 
Compiled currently on GulpJS it making easily to create news plugins and features.

### Features 
- ✔ `CommonJS-style` require() & modules.exports for load modules from NPM like in nodejs, browserify, webpack.
- ✔ Open AS3 to NPM.
- ✔ IDE Free. Work on your favorite text editor.
- ✔ browser development, with livercompiler and liverload. 
- ✔ Ready to Code. No need to start with [package -> public class -> public funciton].
- ✔ load or export swc from NPM.  
- ✔ All of as3 but simpler with more.
- ✔ Open source.

Example :

```javascript
//as3 vanilla
package {
	import flash.display.Sprite;
	public class Main extends Sprite {
		public function Main() {
			trace('hello world');
		}
	}
} // 8 lines

//jinx
trace('hello world'); // one line 
```

### Require()
Load jinx-packages from npm

```javascript
// jinx
// npm install jinx-mempanel
var memPanel  = require("jinx-mempanel");
memPanel(); // load a jinx module + swc that show FPS, Memory usage and Number of particles in a panel.

//or just 
require("jinx-mempanel")();
```

## Getting Started

Cloning this repo. 
This repo is just a jinx boilerplate.

```Batchfile
git clone https://github.com/webcaetano/jinx.git
cd jinx
npm install && bower install
```

Start the development mode.
```Batchfile
gulp serve
```

Create the .swf 
```Batchfile
gulp

# or 

gulp build
```


### First Jinx Modules 

- [jinx-mempanel](https://github.com/webcaetano/jinx-mempanel) Panel of Performance (Memory, FPS, Particles counter) [@webcaetano](https://github.com/webcaetano)
- [jinx-events](https://github.com/webcaetano/jinx-events) MovieClipe Events by Protoype & chaining  [@webcaetano](https://github.com/webcaetano)
- [jinx-error-catcher](https://github.com/webcaetano/jinx-error-catcher) handle error and submit to browser console [@webcaetano](https://github.com/webcaetano)
- [jinx-console](https://github.com/webcaetano/jinx-console) enable console browser object on AS3  [@webcaetano](https://github.com/webcaetano)

### ScreenShots

![jinx-console](http://i.imgur.com/DdARTRu.jpg)


Any ideias? Issues? Have some improvement? Please help us, and make part of this API. :+1:

*"Jinx is not AS3. Is [ADC](http://tinyurl.com/o3llg4l)"* ![Kappa](http://static-cdn.jtvnw.net/emoticons/v1/25/1.0)

---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/webcaetano/jinx/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

