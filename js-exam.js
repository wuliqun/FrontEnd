function myType(param){
	var ret = typeof param;
	if(ret === "object"){
		if(param === null){
			ret = "null";
		}
		ret = param.constructor.toString().match(/function\s(\w+)\(/)[1];
	}
	return ret;
}
//a sorted Array,search dst
function search(arr,dst){
	if(dst < arr[0] || dst > arr[arr.length-1]){
		return -1;
	}
	var begin = 0;
	var end = arr.length-1;
	//二分查找
	var middle = Math.floor((begin+end)/2);
	while(end >= begin){
		if(arr[middle] > dst){
			end = middle-1;
		}else if(arr[middle] < dst){
			begin = middle+1;
		}else{
			return middle;
		}
		middle = Math.floor((begin+end)/2);
	}
	return -1;
}
//日期格式化
function formatDate(date, pattern){
	function padding(num){
		return num<10?'0'+num:''+num;
	}
	return pattern.replace(/[y|M|d|H|m|s]+/g,function($0){
		switch($0){
			case 'yyyy':
				return date.getFullYear();
			case 'MM':
				return padding(date.getMonth()+1);
			case 'dd':
				return padding(date.getDate());
			case 'HH':
				return padding(date.getHours());
			case 'mm':
				return padding(date.getMinutes());
			case 'ss':
				return padding(date.getSeconds());
			default:
				return $0;
		}
	})
}