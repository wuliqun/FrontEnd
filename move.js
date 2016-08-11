/**
 * [move 运动函数]
 * @param  {[element]}   obj    [运动的物体]
 * @param  {[obj]}   attrValue [运动的属性和值组成的对象，如{left:300px,height:100px}]
 * @param  {[number]}   duration  [运动时长]
 * @param  {Function} callback  [运动完成后的回调]
 * @return {[undefined]}       
 */
function move(obj,attrValue,duration,callback){
	//运动回调间隔25ms
	var times = duration/25;
	var attrs = [];
	var targets = [];
	var speeds = [];
	for(var attr in attrValue){
		attrs.push(attr);
		targets.push(attrValue[attr]);
		speeds.push((attrValue[attr] - getStyle(obj,attr))/times);
	}
	//一个元素一次仅进行一项运动，避免混乱
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var finishCount = 0;
		for(var i=0;i<attrs.length;i++){
			if(targets[i] === getStyle(obj,attrs[i])){
				finishCount ++;
			}else{
				if(Math.abs(speeds[i]) > Math.abs(targets[i] - getStyle(obj,attrs[i]))){
					speeds[i] = targets[i] - getStyle(obj,attrs[i]);
				}
				if(attrs[i] == "opacity"){
					if(document.all){
						//兼容
						obj.style.filter="alpha(opacity="+(getStyle(obj,attrs[i])+speeds[i])+")"; 
					}else{
						obj.style.opacity = (getStyle(obj,attrs[i])+speeds[i])/100;
					}							
				}else {
					obj.style[attrs[i]] = getStyle(obj,attrs[i])+speeds[i]+"px";
				}
			}
		}
		if(finishCount === attrs.length){
			clearInterval(obj.timer);
			if(callback){
				callback();
			}
		}
	},25);
}				
//获得元素某一属性的值  返回int
function getStyle(obj,attr){
	var style = obj.currentStyle;
	//兼容
	if(!style){
		style = getComputedStyle(obj, false);
	}
	
	//透明度获取方法有差别
	if(attr == "opacity"){
		if(style[attr]){
			return style[attr]*100;
		}else{
			//IE
			if(!obj.filters.alpha){
				//没写alpha情况  默认为100
				return 100;
			}
			return obj.filters.alpha.opacity;
		}
	}else{
		return parseInt(style[attr]);
	}
}