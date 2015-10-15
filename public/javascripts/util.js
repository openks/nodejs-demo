/**
 * 根据对象列表，对象的属性和该属性的值获取该属性为该值的第一个结果
 * @param objList 对象列表
 * @param prop 对象属性
 * @param value 对象属性的值
 * @returns 对象<br>未找到返回{}
 */
function getObj(objList, prop,value) {
    var obj;
    for (var i = 0; i < objList.length; i++) {
        obj = objList[i];
        if(obj[prop]==value){
            return obj;
        }
    }
    return {};
};
/**
 * 根据localStorage中的参数获取该参数对应列表里的需要的值
 * 
 * @param item localStorage中的名称
 * @param property 要查找对象的属性
 * @param value 要获取对象属性的值
 * @returns 查找到的对象，未找到返回{}
 */
function getObjByProperty(item,property,value,storageType){
	var objList ;
	if(arguments.length==3||storageType.toUpperCase()=="L"){
		objList=JSON.parse(localStorage.getItem(item));
	}else{
		objList=JSON.parse(sessionStorage.getItem(item));
	}
	
	return getObj(objList, property,value);
};