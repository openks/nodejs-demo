var mongoose = require('mongoose');
global.db = mongoose.createConnection();

var host, database, port, options;

if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
    host = 'mongo.duapp.com';
    database = 'your bae database name';
    port = 8908;
    options = {
        server: {poolSize: 5},
        user: 'AK',
        pass: 'SK',
    };
} else {
    host = 'localhost';
    database = 'test';
    port = 27017;
}
db.on('error', function(data){
	console.error("连接失败！");
	console.error(data);
});
db.once('open', function() {
	console.log('连接成功')
		//在这里创建你的模式和模型
});
//断线重连.
db.on('disconnected', function() {
    db.open(host, database, port, options);
});

db.open(host, database, port, options);



var Schema = mongoose.Schema;
var userSchema = new Schema({
	userName : { type: String},
	passWord : { type: String},
	birthday : { type: String},
	gender : { type: Number},
})

//倒出模型
module.exports = db.model('User', userSchema,'user');
/*
--------------------------------------------
var mongoose = require("mongoose");

var uri = 'mongodb://localhost:27017/test';
global.db = mongoose.createConnection(uri);

var Schema = mongoose.Schema;
var userSchema = new Schema({
	userName : { type: String},
	passWord : { type: String},
	birthday : { type: String},
	gender : { type: Number},
})

//倒出模型
module.exports = db.model('User', userSchema,'user');
-------------------


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
*/
