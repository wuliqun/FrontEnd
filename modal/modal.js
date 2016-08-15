var emiter = {
	on:function(e,f){
		this.handler = this.handler||{};
		this.handler[e] = this.handler[e]||[];
		this.handler[e].push(f);
	},
	off:function(e,f){
		if(!e || !this.handler){
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
				i--;
			}
		}
	},
	emit:function(e){
		var args = Array.prototype.slice.call(arguments,1);
		if(this.handler && this.handler[e]){
			for(var i=0;i<this.handler[e].length;i++){
				this.handler[e][i].apply(this,args);
			}
		}
	}
};
(function(){
	function html2node(html){
		var div = document.createElement('div');
		div.innerHTML = html;
		return div.firstElementChild;
	}
	function extend(a1,a2){
		if(!a2) return;
		for(var a in a2){
			if(!a1[a]){
				a1[a] = a2[a];
			}
		}
	}
	var template = 
	'<div class="modal-mask">\
		<div class="modal-align"></div>\
		<div class="modal">\
			<div class="title">\
				<h3 id="title">标题</h3>\
			</div>\
			<div class="content" id="content"></div>\
			<div class="btns clearfix">\
				<button class="btn btn-left">确认</button><button\
				class="btn btn-right">取消</button>\
			</div>\
		</div>\
	</div>';
	function Modal(options){
		this.container = this._layout.cloneNode(true);
		this.wrap = this.container.querySelector('.modal');
		this.body = this.container.querySelector('#content');
		this.head  = this.container.querySelector('#title');
		this.initEvents();
		extend(this,options);
	}
	extend(Modal.prototype,emiter);
	extend(Modal.prototype,{
		_layout:html2node(template),
		setContent:function(content){
			if(!content) return ;
			if(content.nodeType === 1){
				this.body.appendChild(content);
			}else{
				this.body.innerHTML = content;
			}
		},
		show:function(content){
			content = content||this.content;
			this.setContent(content);
			if(!!this.title){
				this.head.innerHTML = this.title;
			}
			document.body.appendChild(this.container);
			animateClass(this.wrap,this.animation.enter);
			// this.wrap.className+=" enter";
		},
		hide:function(){
			var container = this.container;
			animateClass(this.wrap,this.animation.leave,function(){
				document.body.removeChild(container);
			})
			// this.wrap.className = this.wrap.className.split(' ')[0]+" leave";
			// setTimeout(function(){
			// 	document.body.removeChild(container);
			// },1000);
		},
		confirm:function(){
			this.emit('confirm');
			this.hide();
		},
		cancel:function(){
			this.emit('cancel');
			this.hide();
		},
		initEvents:function(){
			this.container.querySelector('.btn-left').addEventListener(
				'click',this.confirm.bind(this),false
			);
			this.container.querySelector('.btn-right').addEventListener
			(
				'click',this.cancel.bind(this),false
			);
		}
	});
	window.Modal = Modal;
})();

//animate.js
var animateClass = (function(){
	var testNode = document.createElement('div');

	var transitionEnd = 'transitionend', 
	    animationEnd = 'animationend', 
	    transitionProperty = 'transition', 
	    animationProperty = 'animation';

    if(!('ontransitionend' in window)){
	    if('onwebkittransitionend' in window) {
	      
	      // Chrome/Saf (+ Mobile Saf)/Android
	      transitionEnd += ' webkitTransitionEnd';
	      transitionProperty = 'webkitTransition'
	    } else if('onotransitionend' in testNode || navigator.appName === 'Opera') {

	      // Opera
	      transitionEnd += ' oTransitionEnd';
	      transitionProperty = 'oTransition';
	    }
 	}
    if(!('onanimationend' in window)){
	    if ('onwebkitanimationend' in window){
	      // Chrome/Saf (+ Mobile Saf)/Android
	      animationEnd += ' webkitAnimationEnd';
	      animationProperty = 'webkitAnimation';

	    }else if ( 'onoanimationend' in testNode ){

	      // Opera
	      animationEnd += ' oAnimationEnd';
	      animationProperty = 'oAnimation';
	    }
  	}
	function addClass(ele,className){
		ele.className += " "+className;
	}
	function delClass(ele,className){
		ele.className = ele.className.replace(' '+className,"").trim();
	}

	return function (ele,className,callback){
		if(!ele || !ele.className){
			callback && callback();
		}
		function onAnimationEnd(){
			delClass(ele,className);
			ele.removeEventListener(animationEnd,onAnimationEnd);
			callback && callback();
		}
		addClass(ele,className);
		ele.addEventListener(animationEnd,onAnimationEnd,false);
	}
})();