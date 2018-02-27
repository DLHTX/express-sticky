var express = require('express');
var router = express.Router();
var Note = require('../models/note.js').Note
/* GET users listing. */
router.get('/notes', function(req, res, next) {
    Note.findAll({raw:true}).then(function (notes) {
        res.send({status:0,data: notes});
    })
});

router.post('/notes/add',function (req,res,next) {
  var note = req.body.note
  var times = req.body.time

  Note.create({text:note},{creatime:times}).then(function () {
      res.send({status:0})
      console.log(Note.createdAt)
  }).catch(function () {
      res.send({status:1 , errorMsg:'数据库出错'})
  })
})
router.post('/notes/edit',function (req,res,next) {
  Note.update({text:req.body.note},{where:{id:req.body.id}}).then(function () {
     res.send({status:0})
  })
})
router.post('/notes/delete',function (req,res,next) {
  Note.destroy({where:{id:req.body.id}}).then(function () {
      res.send({status:0})
  })
})


module.exports = router;
