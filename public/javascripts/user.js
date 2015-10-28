var mongoose = require("mongoose");

// 连接字符串格式为mongodb://主机/数据库名
mongoose.connect('mongodb://localhost:27017/test');

// 数据库连接后，可以对open和error事件指定监听函数。
var db = mongoose.connection;
db.on('error', function(data){
	console.error("连接失败！");
	console.error(data);
});
db.once('open', function() {
	console.log('连接成功')
		//在这里创建你的模式和模型
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
	userName : { type: String},
	passWord : { type: String},
	birthday : { type: String},
	gender : { type: Number},
})
//第三个参数为connection的名字 即表名
var User = mongoose.model('User', userSchema,'user');

//倒出模型
module.exports = User