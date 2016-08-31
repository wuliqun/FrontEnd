/**
 * [cascade 封装任意级联选择器]  
 * @param  {[Array]} selectList [list of selectors]
 * @param  {[Array[obj,obj...]]} data   [data in selectors]
 * @return {[undefined]}  
 */
function cascade(selectList,data){
	/**
	 * [setSelect 设置select]
	 * @param {[number]} index   [需要设置的select位于selectList的下标]
	 * @param {[type]} sdata     [select的数据来源]
	 * @param {[type]} dataIndex [与该select对应的option的dataset.index]
	 */
	function setSelect(index,sdata,dataIndex){
		if(index >= selectList.length)  return;//防止越界
		var select = selectList[index];
		for(var i=select.options.length-1;i>=0;i--){
			select.options.remove(i);
		}
		for(var i=0;i<sdata.length;i++){
			var soption = new Option(sdata[i].text,sdata[i].value);
			//dataset.index 以1-2-5-6的形式指示数据位置
			//如'1-2-5-6' 则代表data[1].list[2].list[5].list[6]
			if(dataIndex){
				soption.dataset.index = dataIndex+'-'+i;
			}else{
				soption.dataset.index = i;					
			}				
			select.appendChild(soption);
		}
		//回调设置下一个select,默认selectIndex = 0
		arguments.callee(index+1,sdata[0].list,dataIndex+'-'+0);
	}
	for(var j=0;j<selectList.length;j++){
		//添加change事件,产生联动效果
		selectList[j].onchange = function(){
			var option = this.options[this.options.selectedIndex];
			//从dataset.index获取需要设置在当前select上的数据
			var indexArr = option.dataset.index.split('-');
			var sdata = data;                       
			for(var i=0;i<indexArr.length;i++){
				sdata = sdata[indexArr[i]-0].list;
			}
			setSelect(indexArr.length,sdata,option.dataset.index);
		}
	}		
	//初始化select
	setSelect(0,data);
}