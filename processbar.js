var util = (function(){
  return {
    extend: function(o1, o2){
      for(var i in o2) if (o1[i] == undefined ) {
        o1[i] = o2[i]
      }
    },
    addClass: function (node, className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current? ( current + " " + className ) : className;
      }
    },
    delClass: function (node, className){
      var current = node.className || "";
      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    },
    emitter: {
      // 注册事件
      on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
          calls = handles[event] || (handles[event] = []);

        // 找到对应名字的栈
        calls.push(fn);

        return this;
      },
      // 解绑事件
      off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          // 找到栈内对应listener 并移除
          for (var i = 0, len = calls.length; i < len; i++) {
            if (fn === calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },
      // 触发事件
      emit: function(event){
        var args = [].slice.call(arguments, 1),
          handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args)
        }
        return this;
      }
    }
  }
})();

//processbar.js
(function(_){
	var template='<div class="process-bar bgscroll"></div>';
	function html2node(str){
		var c = document.createElement('div');
		c.innerHTML = str;
		return c.firstElementChild;
	}
	function ProcessBar(options){
		this.node = this._layout.cloneNode(true);
		_.extend(this,options);
		this.init();
	}
	_.extend(ProcessBar.prototype,{
		_layout:html2node(template),
		setWidth:function(width){
			this.node.style.width = width;
		},
		setBgcolor:function(color){
			this.node.style.backgroundColor = color;
		},
		show:function(){
			this.container = this.container|| document.body;
			this.container.appendChild(this.node);
		},
		hide:function(){
			this.container.removeChild(this.node);
		},
		init:function(){
			if(this.animation){
				_.addClass(this,this.animation);
			}
			var height = this.height || '10px';
			this.node.style.height = height;
			if(this.width){
				this.node.style.width = this.width;
			}
		}
	});
	_.extend(ProcessBar.prototype,_.emitter);
	window.ProcessBar = ProcessBar;
})(util);

