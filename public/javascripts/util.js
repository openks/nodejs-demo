/**
 * 根据对象列表，对象的属性和该属性的值获取该属性为该值的第一个结果
 * @param objList 对象列表
 * @param prop 对象属性
 * @param value 对象属性的值
 * @returns 对象<br>未找到返回{}
 */
function getObj(objList, prop, value) {
	var obj;
	for (var i = 0; i < objList.length; i++) {
		obj = objList[i];
		if (obj[prop] == value) {
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
function getObjByProperty(item, property, value, storageType) {
	var objList;
	if (arguments.length == 3 || storageType.toUpperCase() == "L") {
		objList = JSON.parse(localStorage.getItem(item));
	} else {
		objList = JSON.parse(sessionStorage.getItem(item));
	}

	return getObj(objList, property, value);
};


/**
 * 根据localStorage中的参数修改相应记录的某字段的值
 *
 * @param {Object} item localStorage中的名称
 * @param {Object} property 要查找对象的属性
 * @param {Object} value  要获取对象属性的值
 * @param {Object} newProp 要修改对象的属性
 * @param {Object} newVal 要修改对象的值
 * @param {Object} storageType 存储类型 L为localStorage
 */
function setObjByProperty(item, property, value, newProp, newVal, storageType) {
	var objList, obj;
	if (arguments.length == 5 || storageType.toUpperCase() == "L") {
		objList = JSON.parse(localStorage.getItem(item));
	} else {
		objList = JSON.parse(sessionStorage.getItem(item));
	}
	for (var i = 0; i < objList.length; i++) {
		obj = objList[i];
		if (obj[property] == value) {
			objList[i][newProp] = newVal;
			break;
		}
	}
	if (arguments.length == 5 || storageType.toUpperCase() == "L") {
		localStorage.setItem(item, JSON.stringify(objList));
	} else {
		sessionStorage.setItem(item, JSON.stringify(objList));
	}
};
/**
 * 根据localStorage中的参数修改相应记录的值
 *
 * @param {Object} item localStorage中的名称
 * @param {Object} property 要查找对象的属性
 * @param {Object} value  要获取对象属性的值
 * @param {Object} newProp 修改后对象的属性
 * @param {Object} storageType 存储类型 L为localStorage(默认) s为sessionStorage
 */
function setObjByObjProperty(item, property, value, newObj, storageType){
	var objList, obj;
	if (arguments.length == 4 || storageType.toUpperCase() == "L") {
		objList = JSON.parse(localStorage.getItem(item));
	} else {
		objList = JSON.parse(sessionStorage.getItem(item));
	}
	for (var i = 0; i < objList.length; i++) {
		obj = objList[i];
		if (obj[property] == value) {
			objList[i] = newObj;
			break;
		}
	}
	if (arguments.length == 4 || storageType.toUpperCase() == "L") {
		localStorage.setItem(item, JSON.stringify(objList));
	} else {
		sessionStorage.setItem(item, JSON.stringify(objList));
	}
};
/**
 * 根据身份证号id获取年龄
 * @param {Object} id "511702197409284963"
 */
function getAgeById(id) {
    var birthday = id.substr(6, 8);
    var year = birthday.substr(0, 4);
    var month = birthday.substr(4, 2);
    var day = birthday.substr(6, 2);
    return getAgeByBirthday(year+"-"+month+"-"+day);
}
/**
 * 根据生日字符串获取年龄值
 * @param {Object} birthday "2010-01-01"
 */
function getAgeByBirthday(birthday) {
	var now = new Date();
	var old = new Date(birthday);
	var years = now.getFullYear() - old.getFullYear();
	if (now.getMonth() < old.getMonth()) {
		years = years - 1;
	}else{
		if (now.getDate() < old.getDate()) {
			years = years - 1;
		}
	}
	years = years < 0 ? 0 : years;
	return years;
}
var util_main={};
util_main.getAgeByBirthday=getAgeByBirthday;
if (typeof module !== 'undefined') {
  module.exports = util_main;
}
