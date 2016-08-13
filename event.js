/**
 * [addEvent 元素绑定事件,兼容]
 * @param {[element]} a [需要绑定事件的元素]
 * @param {[string]} b [事件名称]
 * @param {[function]} c [事件函数]
 * @param {[boolean]} d [事件是否在捕获或冒泡阶段执行]
 *                      true 事件句柄在捕获阶段执行
 *                      false  默认,事件句柄在冒泡阶段执行
 */
function addEvent(a,b,c,d){
   if(!d) d=!1;
   if(a.attachEvent){
      a.attachEvent('on'+b,c);
   }else{
      a.addEventListener(b,c,d);
   }
}
/**
 * [getTarget ul ol事件代理,用于获取触发事件的li]
 * @param  {[Event]} e [事件对象]
 * @return {[element]}   [触发事件的li]
 */
function getTarget(e){
   var target = e.target?e.target:e.srcElement;
   //事件直接由ul触发,返回null
   if(target.nodeName === 'UL' || target.nodeName === 'OL'){
      return null;
   }
   //事件有可能由li的子元素触发,向上找parentNode直到找到li
   while(target.nodeName !== 'LI'){
      target = target.parentNode;
   }
   return target;
}
/**
 * [cancelBubble 阻止冒泡]
 */
function cancelBubble(e){
   if(e.stopPropagation){
      e.stopPropagation();
   }else{
      e.cancelBubble = true;
   }
}
/**
 * [preventDft 阻止默认事件]
 */
function preventDft(e){
   if(e.preventDefault()){
      e.preventDefault()
   }else{
      e.returnValue = false;
   }
}
/**
 * [fireEvent 触发事件]
 */
function fireEvent(e,type){      
   if(e.dispatchEvent){
      var ev = document.createEvent('Event');
      ev.initEvent(type,!0,!0);
      e.dispatchEvent(ev);
   }else{
      e.fireEvent('on'+type);
   }
}

// 与事件有关的一些兼容函数