/* slider.js */
var emiter = {
	on:function(e,f){//绑定事件
		//this.handler数据格式 {click:[fn1,fn2...],cancel:[...],...}
		this.handler = this.handler||{};//如果不存在要初始化
		this.handler[e] = this.handler[e]||[];
		if(this.handler[e].indexOf(f) < 0){
			this.handler[e].push(f);
		}
	},
	off:function(e,f){//解绑
		if(!e || !this.handler){//没有传事件名,清空handler
			this.handler = {};
			return;
		}
		if(!this.handler[e] || !f){
			this.handler[e] = [];
			return;
		}	
		for(var i=0;i<this.handler[e].length;i++){
			if(this.handler[e][i] === f){
				this.handler[e].splice(i,1);
				break;
			}
		}
	},
	emit:function(e){//触发
		var args = Array.prototype.slice.call(arguments,1);
		if(this.handler && this.handler[e]){
			for(var i=0;i<this.handler[e].length;i++){
				this.handler[e][i].apply(this,args);
			}
		}
	}
};

(function(){
	function html2node(str){
	    var container = document.createElement('div');
	    container.innerHTML = str;
	    return container.firstElementChild;
	}
	  // 赋值属性
	  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
	function extend(o1, o2){
	    for(var i in o2) if(typeof o1[i] === 'undefined'){
	      o1[i] = o2[i];
	    } 
	}
	var template = 
	'<ul class="slider">\
		<li class="j-item itm" style="left:-100%;">\
		</li>\
		<li class="j-item itm" style="left:0%;">\
		</li>\
		<li class="j-item itm" style="left:100%;">\
		</li>\
	</ul>';
	function Slider(options){
		this.node = this._layout.cloneNode(true);
		this.index = 1;
		this.list = this.node.getElementsByTagName('li');
		extend(this,options);
		for(var i=0;i<this.list.length;i++){
			this.list[i].innerHTML = '<img src="'+this.imgs[i]+'"/>';
		}		
	}
	extend(Slider.prototype,{
		_layout:html2node(template),
		show:function(){
			this.container.appendChild(this.node);
			this.initEvents();
		},
		step:function(d){
			for(var i=0;i<this.list.length;i++){
				var left = parseInt(this.list[i].style.left);
				if(left === d*100){
					var index = this.index-d;
					if(index < 0) index=this.imgs.length-1;
					if(index === this.imgs.length) index = 0;
					delClass(this.list[i],'itm');
					this.list[i].innerHTML = '<img src="'+this.imgs[index]+'"/>';
					this.list[i].style.left = -d*100+'%';
				}else{
					addClass(this.list[i],'itm');
					this.list[i].style.left = left+d*100+'%';
				}
			}
		},
		slide:function(index){
			if(index < 0 || index >= this.imgs.length) return;
			if(Math.abs(this.index-index) === 1){
				var d = this.index -index;
				this.index = index;
				this.step(d);
				return;
			}
			this.index = index;
			var prev = index-1 < 0 ? this.imgs.length -1 : index-1;
			var next = index+1 >= this.imgs.length ? 0 : index+1;
			var arr=[prev,index,next];
			for(var i=0;i<this.list.length;i++){
				delClass(this.list[i],'itm');
				this.list[i].innerHTML = '<img src="'+this.imgs[arr[i]]+'"/>';
				this.list[i].style.left = (i-1)*100+'%';
			}
		},
		slidePrev:function(){
			this.index --;
			if(this.index < 0){
				this.index = this.imgs.length-1;
			}
			this.step(1);
		},
		slideNext:function(){
			this.index ++;
			if(this.index === this.imgs.length){
				this.index = 0;
			}
			this.step(-1);
		},
		initEvents:function(){
			var lis = [].slice.call(this.list);
			var x;
			var percent;		
			var isDrag = !1;
			this.node.addEventListener('mousedown',function(e){
				x = e.pageX;
				isDrag = !0;
				lis.sort(function(a1,a2){
					return parseInt(a1.style.left)-parseInt(a2.style.left);
				});
			},false);
			this.node.addEventListener('mousemove',function(e){
				if(isDrag){
					var dis = e.pageX - x;
					var width = parseInt(getComputedStyle(this,false).width);
					percent = Math.ceil(dis*100/width);
					delClass(lis[1],'itm');
					lis[1].style.left = percent+'%';
					if(percent>0){
						delClass(lis[0],'itm');
						lis[0].style.left = percent-100+'%';
					}else{
						delClass(lis[2],'itm');
						lis[2].style.left  = 100+percent+'%';
					}
				}
				e.preventDefault();
			},false);
			this.node.addEventListener('mouseup',dragEnd,false);
			this.node.addEventListener('mouseout',dragEnd,false);
			function dragEnd(e){
				isDrag = !1;
				for(var i=0;i<lis.length;i++){
					addClass(lis[i],'itm');
				}
				if(percent >= 50){
					lis[1].style.left = '100%';
					lis[0].style.left = '0%';
					delClass(lis[2],'itm');
					lis[2].style.left = '-100%';
				}else if(percent <= -50){
					lis[1].style.left = '-100%';
					lis[2].style.left = '0%';
					delClass(lis[0],'itm');
					lis[0].style.left = '100%';
				}else{
					lis[0].style.left = '-100%';
					lis[1].style.left = '0%';
					lis[2].style.left = '100%';
				}
			}
		}
	});
	function getTarget(e,clazz){
		clazz = clazz||'j-item';
		var node = e.target;
		while(!!node && node.className.indexOf(clazz) < 0){
			node = node.parentNode;
		}
		return node;
	}
	function addClass(ele,className){
		if(ele.className.indexOf(className) < 0){
			ele.className += " "+className;
		}		
	}
	function delClass(ele,className){
		ele.className = ele.className.replace(' '+className,"").trim();
	}
	window.Slider = Slider;
})()

