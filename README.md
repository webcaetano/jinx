# ![Imgur](http://i.imgur.com/FHjshUv.png)

Jinx is an AS3 API, that make AS3 simpler and easy-to-use, but more powerfull with some new features.

Jinx is [NPM](https://www.npmjs.com) friendly , for publish and load Jinxs packages (.jinx, .as and .swc). 
Compiled currently on GulpJS it making easily to create news plugins and features.

### Features 
- :heavy_check_mark: require() & modules.exports for load modules from NPM like in nodejs, browserify, webpack.
- :heavy_check_mark: browser development, with livercompiler and liverload. 
- :heavy_check_mark: Ready to Code. No need to start with [package -> public class -> public funciton].
- :heavy_check_mark: load or export swc. 
- :heavy_check_mark: All of as3 but with more.
- :heavy_check_mark: Open source.

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
memPanel(); // create a panel that show FPS, Memory usage and Number of particles

//or just 
require("jinx-mempanel")();
```

## Getting Started

Cloning this repo.
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

### Project Road : 

- [x] Create test environment in GulpJS using [gulp-flash](https://github.com/webcaetano/gulp-flash)
- [x] Make one Jinx Package for test ([jinx-mempanel](https://github.com/webcaetano/jinx-mempanel))
- [x] Load one Jinx Package via [NPM](https://www.npmjs.com)
- [x] Create a [jinx packages loader](https://github.com/webcaetano/jinx-loader) 
- [x] Create [jinx-compiler](https://github.com/webcaetano/jinx-compiler) with require and headless features
- [ ] Create some jinx packages ([events](https://github.com/webcaetano/jinx-events), utils, errorhandle)
- [ ] Make a gh-page with Examples
- [ ] Dependencies of Dependencies

### First Jinx Modules 

- [jinx-mempanel](https://github.com/webcaetano/jinx-mempanel) Panel of Performance (Memory, FPS, Particles counter) [@webcaetano](https://github.com/webcaetano)
- [jinx-events](https://github.com/webcaetano/jinx-events) MovieClipe Events by Protoype & chaining  [@webcaetano](https://github.com/webcaetano)

Any ideias? Issues? Have some improvement? Please help us, and make part of this API. :+1:

---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/jinx/master/LICENSE.md)
