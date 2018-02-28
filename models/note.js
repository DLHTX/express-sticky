var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined,undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',

    // SQLite only
    storage: path.join(__dirname, '../database/database.sqlite')
});

// sequelize
//     .authenticate()
//     .then(function(err) {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(function (err) {
//         console.log('Unable to connect to the database:', err);
//     }); 测试数据库连接是否正常

var Note = sequelize.define('note', {
    text: {
        type: Sequelize.STRING
    },
    uid: {
        type: Sequelize.STRING
    },
    username:{
        type: Sequelize.STRING
    }
});//定义一个模型 相对于数据库里面的一个表 空数据库 必须创建表结构

// Note.sync({force:true})
//
// Note.create({text:'欢迎大家来到这里做客！赶快登录添加属于你的便签吧~' })
//重置一次数据库
//  Note.sync().then(function () {
//
// })//创建数据
// }).then(function () {
//     Note.findAll({raw: true}).then(function (users) {
//         console.log(users)
//     })//查找
//
    Note.findAll({raw: true , where:{uid:21312}}).then(function(articles) {
      console.log(articles)
    })
//查找真实数据
//
// })
//
// Note.findAll({raw:true , where:{id:2}}).then(function (notes) {
//     console.log(notes)
// })  //查询id为2的数据


module.exports.Note = Note
