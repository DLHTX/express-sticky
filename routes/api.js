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
    Note.findAll(query).then(function (notes) {
        res.send({status:0,data: notes});
    })
});


router.post('/notes/add',function (req,res,next) {
    var note = req.body.note
    if(!req.session.user){
      return res.send({status:1 , errorMsg:'添加失败，请先登录'})
    }
    var uid = req.session.user.id
    var username = req.session.user.username

    Note.create({text:note , uid:uid , username:username}).then(function() {ls
      res.send({status:0 , username:req.session.user.username} )
      console.log(Note.createdAt)
  }).catch(function () {
      res.send({status:1 , errorMsg:'数据库出错'})
  })
})


router.post('/notes/edit',function (req,res,next) {
    if(!req.session.user){
        return res.send({status:1 , errorMsg:'编辑失败，请先登录'})
    }
    var uid = req.session.user.ui
  Note.update({text:req.body.note},{where:{id:req.body.id, uid:uid}}).then(function () {
     res.send({status:0})
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
