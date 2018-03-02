require('less/note.less')
var $ = require('jquery')
var Event = require('./event.js')
var Toast = require('./toast.js').Toast
var waterfall = require('./waterfall.js')
var myDate = new Date()
this.currentime = myDate.getFullYear()+'年'+myDate.getMonth()+'月'+ myDate.getDate() +'日' +myDate.getSeconds()+ '秒'

function Note(opts) {
    this.initnote(opts)
    this.createnote()
    this.setStyle()
    this.bindEvent()

}


Note.prototype = {
    defaultOpts:{
        id:'',
        $ct: $('#content').length>0?$('#content'):$('body'),
        context:'请输入一些东西吧！',
        username:'我',
        star:undefined
    },
    colors: [
        ['#ea9b35'],['#efb04e'],
        ['#dd598b'],['#e672a2'],
        ['#ff4b4e'],['#3C74F7'],
        ['#c24226'],['#d15a39'],
        ['#08aa36'],['#5191FD'],
        ['#3f78c3'],['#5591d2']
    ],
    initnote:function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts||{});
        if(this.opts.id){
            this.id = this.opts.id
        }

    },

    createnote:function () {
        var tpl = `<div class="box">
            <div class="note-head"> <span class="username"></span><span>的便签</span>
            <i class="iconfont icon-del"></i>
            </div>
            <div class="note-content"  contenteditable="true"> </div>
            <ul class="starbox clearfix">
                <li class='star iconfont icon-star select'></li>
                <li class='star iconfont icon-star' ></li>
                <li class='star iconfont icon-star'></li>
                <li class='star iconfont icon-star'></li>
                <li class='star iconfont icon-star'></li>
            </ul>
            <div class="ps"><i class="iconfont icon-gou"></i></div>
            `
        this.$note = $(tpl)
        this.$note.find('.note-content').text(this.opts.context)
        this.$note.find('.username').text(this.opts.username);
        this.$note.find('.starbox .star').eq(this.opts.star).nextAll().removeClass('select')
        console.log(this.opts.star)
        this.$note.find('.starbox .star').eq(this.opts.star).addClass('select').prevAll().addClass('select')
        this.opts.$ct.append(this.$note)

    },


    setStyle: function () {
        var color = this.colors[Math.floor(Math.random()*12)];
        var height = Math.floor(Math.random()*20 + 12)
        this.$note.find('.ps').css('background-color', color[0]);
        this.$note.find('.note-content').css('min-height', height + 'vh');

    },

    setLayout:function () {
        var _this = this
        if(_this.clk){
            clearTimeout(_this.clk)
        }
        _this.clk = setTimeout(function () {
            Event.fire('waterfall')
        },100)
    },

    bindEvent:function () {
        var _this = this,
            $note = this.$note
            $ps = $note.find('.ps')
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-content'),
            $delete = $note.find('.icon-del'),
            $box = $note.find('.box');
            $login = $('.logoin')
            $qqlogin = $('.qq-logoin')
            $star = $note.find('.starbox .star')






        $star.on('click',function(){
            _this.index = $(this).index()
            console.log($(this).index())
            $(this).nextAll().removeClass('select')
            $(this).addClass('select').prevAll().addClass('select')
            // _this.editstar($(this).index())
 })




        $delete.on('click', function(){
            _this.delete();
         })

        $login.on('click', function(){
          _this.login()
        })

        $qqlogin.on('click', function(){
            _this.qqlogin()
        })


        // contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
        // $noteCt.on('focus',function () {
        //     if($noteCt.text() == '请输入一些东西吧！' ) $noteCt.text('')
        //      $noteCt.data('before', $noteCt.text());
        //     }).on('blur paste',function () {
        //     if( $noteCt.data('before') != $noteCt.text() ) {
        //         $noteCt.data('before',$noteCt.text());
        //         _this.setLayout();
        //         if(_this.id){
        //             _this.edit($noteCt.text())
        //         }else{
        //
        //             _this.add($noteCt.text(),_this.index)
        //         }
        //     }
        // });
        //
        // contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
        $noteCt.on('focus',function () {
            if($noteCt.text() == '请输入一些东西吧！' ) $noteCt.text('')
            $noteCt.data('before', $noteCt.text());
        })
        $ps.on('click',function () {
            $noteCt.data('before', $noteCt.text(''));
            if( $noteCt.data('before') != $noteCt.text() ) {
                    $noteCt.data('before',$noteCt.text());
                    _this.setLayout();
                    if(_this.id){
                        _this.edit($noteCt.text(),_this.index||0)
                    }else{
                        _this.add($noteCt.text(),_this.index||0)
                        console.log(_this.index)
                    }
                }

        })





        //设置笔记的移动
        $noteHead.on('mousedown', function(e){
            var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
                evtY = e.pageY - $note.offset().top;
            $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
        }).on('mouseup', function(){
            $note.removeClass('draggable').removeData('pos');
        });

        $('body').on('mousemove', function(e){
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
                left: e.pageX-$('.draggable').data('evtPos').x
            });
        });
        },


    edit: function (msg,index) {
        var self = this;

        $.post('/api/notes/edit',{
            id: this.id,
            note: msg,
            star:index
        }).done(function(ret){
            if(ret.status === 0){
                Toast('编辑完成!');
            }else{
                Toast(ret.errorMsg);
            }
        })
    },

    // editstar: function (index) {
    //   $.post('api/notes/editstar',{star:index})
    //       .done(function (ret) {
    //           if(ret.status === 0){
    //               Toast('编辑星星成功')
    //               console.log(ret.star)
    //           }else{
    //               Toast(ret.errorMsg)
    //           }
    //       })
    // },
    //


    add: function (msg,index){
        var self = this;
        console.log(index)
        $.post('/api/notes/add', {note: msg , star:index})
            .done(function(ret){
                if(ret.status === 0){
                    console.log(ret.star)
                    Toast('添加成功!');
                    }else{
                    self.$note.remove();
                    Event.fire('waterfall')
                    Toast(ret.errorMsg);
                }
            });
        //todo
    },

    delete: function(){
        var self = this;
        $.post('/api/notes/delete', {id: this.id })
            .done(function(ret){
                if(ret.status === 0){
                    Toast('删除成功！');
                    self.$note.remove();
                    Event.fire('waterfall')
                }else{
                    Toast(ret.errorMsg);
                }
            });
        },

    login:function () {
       location.href='auth/github'
    },
    qqlogin:function () {
        location.href='auth/qq'
    }




    }









module.exports.Note = Note;
