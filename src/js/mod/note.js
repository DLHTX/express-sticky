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
        $ct:$('#content'),
        context:'请输入一些东西吧！',
        username:'我',
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
            <div class="note-head"><span class="username"></span><span>的便签</span></div>
            <div class="note-content"  contenteditable="true"> </div>
            <div class="ps">未完成</div>`
        this.$note = $(tpl)
        this.$note.find('.note-content').text(this.opts.context)
        this.$note.find('.username').text(this.opts.username);
        this.opts.$ct.append(this.$note)
        console.log(this.opts.username)
    },


    setStyle: function () {
        var color = this.colors[Math.floor(Math.random()*12)];
        var height = Math.floor(Math.random()*20 + 12)
        this.$note.find('.ps').css('background-color', color[0]);
        this.$note.find('.note-content').css('height', height + 'vh');

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
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-content'),
            $delete = $note.find('.ps'),
            $box = $note.find('.box');
            $login = $('.logoin')





        $delete.on('click', function(){
            _this.delete();
         })

        $login.on('click', function(){
          _this.login()
        })


        //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
        $noteCt.on('focus',function () {
            var _this = this
            if($noteCt.html() == '请输入一些东西吧！' ) $noteCt.html('')
             $noteCt.data('before', $noteCt.html());
            }).on('blur paste',function () {
            if( $noteCt.data('before') != $noteCt.html() ) {
                $noteCt.data('before',$noteCt.html());
                _this.setLayout();
                if(_this.id){
                    _this.edit($noteCt.html())
                }else{
                    _this.add($noteCt.html())
                }
            }
        });

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


    edit: function (msg) {
        var self = this;

        $.post('/api/notes/edit',{
            id: this.id,
            note: msg
        }).done(function(ret){
            if(ret.status === 0){
                Toast('编辑完成!');
            }else{
                Toast(ret.errorMsg);
            }
        })
    },

    add: function (msg){
        var self = this;
        $.post('/api/notes/add', {note: msg })
            .done(function(ret){
                self.name = ret.username
                if(ret.status === 0){
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
        $.post('/api/notes/delete', {id: this.id})
            .done(function(ret){
                if(ret.status === 0){
                    self.$note.remove();
                    Toast('删除成功！');
                    Event.fire('waterfall')
                }else{
                    Toast(ret.errorMsg);
                }
            });
        },

    login:function () {
       location.href='auth/github'
    }




    }









module.exports.Note = Note;