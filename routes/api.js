var express = require('express');
var router = express.Router();
var Note = require('../models/note.js').Note
/* GET users listing. */



router.get('/notes', function(req, res, next) {
    var query = {raw:true}

    if(!req.session.user){
        query.raw = true
    }else {
        query.where = {
            uid:req.session.user.id
        }
    }
    Note.findAll({raw:true}).then(function (notes) {
        res.send({status:0,data: notes});
    }).catch(function () {
        res.send({status:1 , errorMsg:'数据库出错2'})
    })
});


// router.post('/notes/editstar',function (req,res,next) {
//     var star = req.body.star
//     if(!req.session.user){
//         return res.send({status:1 , errorMsg:'星星失败，请先登录'})
//     }
//     var uid = req.session.user.id
//     var username = req.session.user.username
//
//     Note.create({star:star}).then(function () {
//         res.send({status:0 , star:star})
//     })
// })

router.post('/notes/add',function (req,res,next) {
    var note = req.body.note
    var star = req.body.star
    if(!req.session.user){
      return res.send({status:1 , errorMsg:'添加失败，请先登录'})
    }
    var uid = req.session.user.id
    var username = req.session.user.username

    Note.create({text:note , uid:uid , username:username , star:star}).then(function() {
      res.send({status:0 , username:req.session.user.username ,star:star} )
  }).catch(function () {
      res.send({status:1 , errorMsg:'数据库出错(添加)'})
  })
})


router.post('/notes/edit',function (req,res,next) {

    if(!req.session.user){
        return res.send({status:1 , errorMsg:'编辑失败，请先登录'})
    }
    var uid = req.session.user.id
    var username = req.session.user.username
  Note.update({text:req.body.note, star:req.body.star},{where:{id:req.body.id, username:username}}).then(function () {
     res.send({status:0})
  }).catch(function () {
      res.send({status:1 , errorMsg:'数据库出错(编辑)'})
  })
})



router.post('/notes/delete',function (req,res,next) {
    if(!req.session.user){
        return   res.send({status:1 , errorMsg:'删除失败，请先登录'})
    }
    var uid = req.session.user.id

   Note.destroy({where:{id:req.body.id, uid:uid}}).then(function () {
      res.send({status:0})
  })
})


module.exports = router;
