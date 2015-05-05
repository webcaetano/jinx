/**
Author : Andre Caetano 2015
**/

import flash.events.Event;
import flash.events.MouseEvent;
import flash.external.ExternalInterface;
import flash.filters.BitmapFilter;
import flash.filters.ColorMatrixFilter;
import flash.filters.DropShadowFilter;
import flash.geom.*;
import flash.display.*;
import flash.net.*;
import flash.text.TextField;
import flash.utils.*;
import flash.events.ErrorEvent;
import flash.events.UncaughtErrorEvent;
import flash.filters.GlowFilter;
import flash.system.*;

/* CONSOLE.log */
function $trace($){
	ExternalInterface.call("console.log",$);
}

var console={'log':function($){$trace($)}};

/* MULTI PROTOTYPE */
var $prototype = function(name,f){
	var protos = [Bitmap,MovieClip,TextField];
	for(var i in protos) protos[i].prototype[name] = f;
}

/* INLINE AS3 */
MovieClip.prototype.$stop = function(){
	this.stop();
	return this;
}

MovieClip.prototype.$gotoAndStop = function(){
	this.gotoAndStop.call(null,arguments.splice(0,1));
	return this;
}

MovieClip.prototype.$gotoAndPlay = function(){
	this.gotoAndPlay.call(null,arguments.splice(0,1));
	return this;
}

TextField.prototype.$if = MovieClip.prototype.$if = function(Bool,$=null){
	if(Bool){
		if($) $.call(this);
		return this;
	}

	return;
}

$prototype('$set',function(prop,val){
	if(typeof prop==='object'){
		for(var i in prop){
			if(i.indexOf('.')==-1){
				this[i]=prop[i];
			} else {
				var pathObj = i.split(".");
				var c = this;
				for(var k=0;k<pathObj.length-1;k++) c=c[pathObj[k]];
				c[pathObj[pathObj.length-1]]=prop[i];
			}
		}
	} else {
		this[prop]=val;
	}
	return this;
});

$prototype('$add',function(obj=null){
	if(!obj) {
		addChild(this);
	} else {
		obj.addChild(this);
	}
	return this;
});

MovieClip.prototype.$index = function(val,obj=null){
	if(!obj){
		if(!val) val = numChildren-1;
		setChildIndex(this,val);
	} else {
		if(!val) val = obj.numChildren-1;
		obj.setChildIndex(this,val);
	}
	return this;
}

MovieClip.prototype.$hit = function(){
	this.dispatchEvent(new MouseEvent(MouseEvent.CLICK));
}

MovieClip.prototype.$do = function(func){
	if(!$isArray(func)) func=[func];
	var myself = this;
	func.map(function(f){
		f.call(myself);
	});
	return this;
}

$prototype('$remove',function(){
	if(this+""=='[object MovieClip]')this.$unbindAll();
	this.parent.removeChild(this);
	return this;
});

var $bmpData = function(obj,width=null,height=null,x=0,y=0,margin=0){
	var bitmapData:BitmapData = new BitmapData((width && width!='pivot' ? width : obj.width)+(margin*2), (height ? height : obj.height)+(margin*2), true, 0xffffff);
	//var move = [obj.x,obj.y]
	if(x=='center' || y=='center') {
		x=obj.width/2;
		y=obj.height/2;
		obj.x-=obj.width/2;
		obj.y-=obj.height/2;
	}
	if(width=='pivot'){
		var bounds = obj.getBounds(obj);
		x=bounds.x*-1;
		y=bounds.y*-1;
	}
	var tmp = new Matrix();
	tmp.translate(x+margin,y+margin);
	bitmapData.draw(obj, tmp);
	return bitmapData;
}

var $bmp = function(obj,width=null,height=null,x=0,y=0,margin=0){
	var bitmapData:BitmapData = $bmpData(obj,width,height,x,y,margin);
	var move = [obj.x,obj.y]
	if(x=='center' || y=='center') {
		obj.x-=obj.width/2;
		obj.y-=obj.height/2;
	}
	if(width=='pivot'){
		var bounds = obj.getBounds(obj);
		move=[bounds.x,bounds.y];
	}
	var bitmap:Bitmap = new Bitmap(bitmapData);
	obj.parent.addChild(bitmap);
	bitmap.x=move[0];
	bitmap.y=move[1];
	obj.$remove();
	//obj=bitmap;
	return bitmap;
}

var $new = function(objName=null){
	if(!objName){
		return new MovieClip();
	} else {
		return new (getDefinitionByName(objName) as Class)(); // <-- still not working on flex.
	}
}

var $allChild = function (target){
	var children = [];

	for (var i=0;i<target.numChildren;i++) children.push(target.getChildAt(i));

	if(children.length==0) return null;
	return children;
}

$prototype('$sendBack',function(){
	var place = this.parent;
	var dep = place.getChildIndex(this);
	$allChild(place).map(function(e){
		if(place.getChildIndex(e)<dep) place.setChildIndex(e,place.getChildIndex(e)+1);
	});
	place.setChildIndex(this,0);
	return this;
});

MovieClip.prototype.$sendFront = function(){
	this.parent.setChildIndex(this,this.parent.numChildren-1);
	return this;
}

/* START TINT SCRIPT */
function $setColor(mc, r, g, b, a, brightness){
	var matrix:Array = [
		r, 0, 0, 0, brightness, // red
		0, g, 0, 0, brightness, // green
		0, 0, b, 0, brightness, // blue
		0, 0, 0, a, 0  // alpha
	];

	var filter:BitmapFilter = new ColorMatrixFilter(matrix);
	mc.filters = new Array(filter);
}

function $setColorFromHex(mc, rgb, alpha=100, brightness=0){
	rgb='0x'+rgb;
	var r:Number = (rgb & 0x00FF0000) >>> 16;
	var g:Number = (rgb & 0x0000FF00) >>> 8;
	var b:Number = rgb & 0x000000FF;

	$setColor(mc, r/255, g/255, b/255, alpha/100, brightness*255/100);
}

MovieClip.prototype.$tint = function(color,alpha=100,brightness=0){
	$setColorFromHex(this, color, alpha, brightness);
	return this;
}

MovieClip.prototype.$border = TextField.prototype.$border = function(color){
	color='0x'+color;
	var filter_shadow:DropShadowFilter = new DropShadowFilter(0, 0, color, 10, 2, 2, 9);
	this.filters = [filter_shadow];
	return this;
}

var $colors = {
	hexDigits:["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],
	rgb2hex:function(rgb){
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
	},
	hex:function(x){
		return isNaN(x) ? "00" : this.hexDigits[(x - x % 16) / 16] + this.hexDigits[x % 16];
	},
	LightenDarkenColor:function(col, amt) {
		if(col.length>7) col = this.rgb2hex(col);
		amt=amt*255/100;
		var usePound = true, i;

		if (col[0] == "#") {
			col = col.slice(1);
			usePound = true;
		}

		if(col.length<7){
			for(i=0;i<6;i++){
				if(col.length<6){
					col+=col[0];
				} else {
					break;
				}
			}
		}

		var num = parseInt(col,16);

		var r = (num >> 16) + amt;

		if (r > 255) r = 255;
		else if  (r < 0) r = 0;

		var b = ((num >> 8) & 0x00FF) + amt;

		if (b > 255) b = 255;
		else if  (b < 0) b = 0;

		var g = (num & 0x0000FF) + amt;

		if (g > 255) g = 255;
		else if (g < 0) g = 0;

		var c = (g | (b << 8) | (r << 16)).toString(16);
		for(i=0;i<6;i++){
			if(c.length<6){
				c+=0;
			} else {
				break;
			}
		}
		return (usePound?"#":"") + c;
	},
	darken:function(col, amt){
		return this.LightenDarkenColor(col,(amt>0 ? amt*-1 : amt));
	},
	lighten:function(col, amt){
		return this.LightenDarkenColor(col,(amt<0 ? amt*-1 : amt));
	}
};
/* END TINT SCRIPT */



/* START EFFECTS */
TextField.prototype.$hide = MovieClip.prototype.$hide = function(){
	this.visible = false;
	return this;
}

TextField.prototype.$show = MovieClip.prototype.$show = function(){
	this.visible = true;
	return this;
}

TextField.prototype.$toggle = MovieClip.prototype.$toggle = function(){
	this.visible = !this.visible;
	return this;
}

TextField.prototype.$scale = MovieClip.prototype.$scale = function(por=100){
	this.$set({
		width:this.width*por/100,
		height:this.height*por/100
	});
	return this;
}

TextField.prototype.$fadeOut = MovieClip.prototype.$fadeOut = function(time=1000,callback=null,until=0){
	if(typeof time === 'function'){
			callback=time;
			time=1000;
	}
	var alphaPerSec=1/((time*stage.frameRate)/1000);
	if(this._fadeAnimation){
		this.removeEventListener(Event.ENTER_FRAME,this._fadeAnimation);
		this._fadeAnimation=null;
	}
	var a;
	this.addEventListener(Event.ENTER_FRAME,a=function(e:Event){
		if(e.target.alpha>until){
			e.target.alpha-=alphaPerSec;
		} else {
			e.target.removeEventListener(Event.ENTER_FRAME,a);
			this._fadeAnimation=null;
			e.target.alpha=until;
			if(callback)callback.call(e.target,e);
		}
	});
	this._fadeAnimation=a;
	return this;
}

TextField.prototype.$fadeIn = MovieClip.prototype.$fadeIn = function(time=1000,callback=null,until=1){
	var alphaPerSec=1/((time*stage.frameRate)/1000);
	if(this._fadeAnimation) {
		this.removeEventListener(Event.ENTER_FRAME,this._fadeAnimation);
		this._fadeAnimation=null;
	}
	var a;
	this.addEventListener(Event.ENTER_FRAME,a=function(e:Event){
		if(e.target.alpha<until){
			e.target.alpha+=alphaPerSec;
		} else {
			e.target.removeEventListener(Event.ENTER_FRAME,a);
			this._fadeAnimation=null;
			e.target.alpha=until;
			if(callback)callback.call(e.target,e);
		}
	});
	this._fadeAnimation=a;
	return this;
}
/* END EFFECTS */

/* START MOVE SCRIPT */
MovieClip.prototype.$follow = function(obj,offSetX=0,offSetY=0){
	this.$unFollow().addEventListener(Event.ENTER_FRAME,this.followFunc=function(e:Event){
		e.target.$set({'x':obj.x+offSetX,'y':obj.y+offSetY});
	});
	return this;
}

MovieClip.prototype.$unFollow = function(){
	if(!this.followFunc) return this;
	this.removeEventListener(Event.ENTER_FRAME,this.followFunc);
	return this;
}

MovieClip.prototype.$followMouse = function(offSetX=0,offSetY=0){
	this.$unFollow().addEventListener(Event.ENTER_FRAME,this.followFunc=function(e:Event){
		e.target.$set({'x':mouseX+offSetX,'y':mouseY+offSetY});
	});
	return this;
}

$prototype('$copyPos',function(obj){
	this.x=obj.x;
	this.y=obj.y;
	return this;
});

MovieClip.prototype.$copyPosGlobal = function(obj){
	var globalPoint:Point = obj.localToGlobal(new Point(0,0));
	this.x = globalPoint.x;
	this.y = globalPoint.y;
	return this;
}

/* END MOVE SCRIPT */

/* CAUC FUNCS */
var $sort = function(obj,property){
	var dynamicSort = function(property){
		var sortOrder = 1;
		if(property.substr(0,1) === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

	var multiSort = function(props){
		return function (obj1, obj2) {
			var i = 0, result = 0, numberOfProperties = props.length;
			while(result === 0 && i < numberOfProperties) result = dynamicSort(props[i++])(obj1, obj2);
			return result;
		}
	}

	if(!$isArray(property)){
		obj.sort(dynamicSort(property));
	} else {
		obj.sort(multiSort(property));
	}
}

var $caucRateTime = function(time){
	return stage.frameRate*time/1000;
}

var $randomIndex = function(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

var $isArray = function($){
	return Object.prototype.toString.call($) === '[object Array]';
}

var $isNumber = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var $nextNewIndex = function(obj){
	var c=0;
	for(var i in obj) if($isNumber(i)) c++;
	return c;
}

var $clone = function(obj){
	var resp=($isArray(obj) ? [] : {});
	for(var i in obj) {
		if(typeof obj[i]=='object'){
			resp[i]=$clone(obj[i]);
		} else {
			resp[i]=obj[i];
		}
	}
	return resp;
}

/* DISTANCE FUNCTIONS */
var $randomRange = function(obj,size){
	return [(obj.x-size/2)+(Math.random()*size),(obj.y-size/2)+(Math.random()*size)];
}

var $inRange = function(obj,target,range){
	return $dist(obj,target)<=range;
}

var $dist = function(obj1,obj2){
	var dx = obj1.x-obj2.x;
	var dy = obj1.y-obj2.y;
	return Math.sqrt((dx*dx)+(dy*dy));
}

/* START SOME PHP FUNCS */
var $rand = function(min, max){
  if (arguments.length === 0) {
	min = 0;
	max = 100;
  } else if (arguments.length === 1) throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var $str_replace = function(search, replace, subject, count) {
	var i = 0,    j = 0,    temp = '',    repl = '',    sl = 0,    fl = 0,    f = [].concat(search),    r = [].concat(replace),    s = subject,
	ra = Object.prototype.toString.call(r) === '[object Array]',
	sa = Object.prototype.toString.call(s) === '[object Array]';
	s = [].concat(s);
	if (count)this.window[count] = 0;

	for (i = 0, sl = s.length; i < sl; i++) {
		if (s[i] === '') continue;
		for (j = 0, fl = f.length; j < fl; j++) {
			temp = s[i] + '';
			repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
			s[i] = (temp).split(f[j]).join(repl);
			if (count && s[i] !== temp) this.window[count] += (temp.length - s[i].length) / f[j].length;
		}
	}
	return sa ? s : s[0];
}

var $in_array = function(needle, haystack, argStrict){
	var key = '',
	strict = !! argStrict;

	if (strict){
		for (key in haystack) if (haystack[key] === needle) return true;
	} else {
		for (key in haystack) if (haystack[key] == needle) return true;
	}
	return false;
}

/* LOADERS */
var $isJSON = function(str){
	return (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
	replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
	replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
}

var $load = function(url,callback,method=null,data=null){
	var loader:URLLoader = new URLLoader();
	var request:URLRequest = new URLRequest(url);

	if(method!=null){
		if(method=='post') request.method = URLRequestMethod.POST;
		if(data){
			var variables : URLVariables = new URLVariables();
			for(var i in data) variables[i]=JSON.stringify(data[i]);
			//variables.data = JSON.stringify(data);
			request.data = variables;
		}
	}

	loader.addEventListener(Event.COMPLETE, function(e:Event){
		if(callback) callback.call(null,e.target.data);
	});
	loader.load(request);
}

var $http = function(url,data=null,callback=null,method=null){
	if(typeof data == 'function') callback = data;

	$load(url,function(data){
		if($isJSON(data)) data = JSON.parse(data);
		if(callback) callback.call(null,data);
	},method,data);
}

var $get = function(url,data=null,callback=null){
	$http(url,data,callback,'get');
}

var $post = function(url,data=null,callback=null){
	$http(url,data,callback,'post');
}

var $doURL = function(url,target='_self'){
	navigateToURL(new URLRequest(url), target);
}

var $newImg = function(where,url,arg1='img',arg2='img'){
	var options = {'imageName':'img','callback':null};
	var opt = {};
	if(typeof arg1=='function' || typeof arg2=='function') opt=(typeof arg1=='function' ? arg1 : arg2);
	for(var i in opt) if(opt[i]) options[i]=opt[i];

	var imageLoader:Loader = new Loader();
	var image:URLRequest = new URLRequest(url);
	var tmpObj = new MovieClip();
	imageLoader.load(image);
	tmpObj.addChild(imageLoader);
	where.addChild(tmpObj);
	where[options['imgName']]=imageLoader;

	if(options['callback']){
		imageLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event){
			options['callback'].call(e.target,null,e);
		});
	}
	return tmpObj;
}

/* LOAD IMG */
MovieClip.prototype.$addImg = function(url,arg1='img',arg2='img'){
	$newImg(url,arg1,arg2);
	return this;
}

/* ERROR HANDLE */
if(loaderInfo.hasOwnProperty("uncaughtErrorEvents")) loaderInfo.uncaughtErrorEvents.addEventListener(UncaughtErrorEvent.UNCAUGHT_ERROR, function uncaughtErrorHandler( event:UncaughtErrorEvent ):void {
	var deepDir = 2;
	var maxStack = 3; // 0 for infinite;
	var errorText:String;
	var errorObj:Object = {};
	var stack:String;
	if( event.error is Error ) {
		errorText = (event.error as Error).message;
		errorObj.msg = errorText;
		stack = (event.error as Error).getStackTrace();
		errorObj.stack = stack;
		if(stack != null){ errorText += stack; }
	} else if( event.error is ErrorEvent ) {
		errorText = (event.error as ErrorEvent).text;
	} else {
		errorText = event.text;
	}
	event.preventDefault();

	var resp = [];
	var asSplit = errorText.split(".as:");
	for(var i=1;i<asSplit.length;i++){
		var dir = [];
		for(var k=deepDir;k>0;--k) dir.push(asSplit[i-1].split('\\').slice(k*-1)[0]);
		resp.push(dir.join("/")+".as:"+asSplit[i].split("]")[0]);
		if(maxStack && i>=maxStack) break;
	}

	console.log(errorObj.msg+"\n\n"+resp.join('\n'));
});

/* EXTERNAL FUNCS */
var $js = function(js){
	ExternalInterface.call(js);
}

var $getParams = function(){
	return LoaderInfo(root.loaderInfo).parameters;
};

var $link = {};
var $setVar = function(nameVar,val){
	$link[nameVar]=val;
}

var $outFunc = function(name,func){
	if($link[name]) return name;
	$addLink(name,func);
	return name;
}

var $addLink = function(name,func){
	$link[name] = func;
}

var $runFunc = function(nameFunc){
	arguments.splice(0,1);
	$link[nameFunc].apply(null,arguments);
}

ExternalInterface.addCallback("setVar", $setVar);
ExternalInterface.addCallback("runFunc", $runFunc);
