var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var logindata
    if(req.session.user){ //判断是否存在
      logindata = {
           isLogin:true,
           user:{
               avatar:req.session.user.avatar,
               username:req.session.user.username
           }
       }
   }else {
       logindata = {
           isLogin:false
        }
    }

  res.render('index', logindata);
});

module.exports = router;
