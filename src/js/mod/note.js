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
        time:this.currentime
    },
    colors: [
        ['#ea9b35'],['#efb04e'],
        ['#dd598b'],['#e672a2'],
        ['#ff4b4e'],['#3C74F7'],
        ['#c24226'],['#d15a39'],
        ['#08aa36'],['#5191FD'],
        ['#3f78c3'],['#5591d2']
    ],
    text:[
        ['当神已无能为力，那便是魔渡众生'],
        ['那是不同高度上的两片云---你在底下看上去它们重合了，事实上却永远不会相遇。'],
        ['纵然是七海连天，也会干涸枯竭'],
        ['这世间的种种生死离别，来了又去'],
        ['可是 所爱的人啊 只要我曾真的爱过你 那我就永远不会忘记'],
        ['日光照到的一切地方都有阴影'],
        ['原来这一场千里的跋涉，只不过是来做最后一次甚至无法相见的告别。'],
        ['君生我未生，我生君已老。'],
        ['隔了百年的光阴，万里的迢梯,浮世肮脏，人心险诈，割裂了生和死。到哪里,再去寻找.纯白如羽的华衣,还有那张莲花般的素颜'],
        ['我只是一个人，天地都背弃'],
        ['梦想与荣耀同在······'],
        ['别后相思空一水，重来回首已三生。'],
        ['没有一颗心朝向你，没有一个人会想起你，天地之大，也无你的立锥之地'],

    ],



    initnote:function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts||{});
        if(this.opts.id){
            this.id = this.opts.id
        }
        console.log('init')
    },

    createnote:function () {
        var tpl = `<div class="box">
            <div class="note-head"></div>
            <div class="note-content"  contenteditable="true"> </div>
            <div class="ps">未完成</div>`
        this.$note = $(tpl)
        this.$note.find('.note-content').text(this.opts.context)
        this.opts.$ct.append(this.$note)
        this.$note.find('.note-head').text(myDate.getFullYear()+'年'+myDate.getMonth()+'月'+ myDate.getDate() +'日' +myDate.getSeconds()+ '秒');
    },


    setStyle: function () {
        var color = this.colors[Math.floor(Math.random()*12)];
        var height = Math.floor(Math.random()*20 + 12)
        var text = this.text[Math.floor(Math.random()*12)]
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

        $delete.on('click', function(){

           _this.delete();
            })


        //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
        $noteCt.on('focus',function () {
            _this.text.forEach(function (e) {
                _this.array = e

            })
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
        console.log('addd...');
        var self = this;
        $.post('/api/notes/add', {note: msg ,time:this.opts.time})
            .done(function(ret){
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
                    Event.fire('waterfall')
                }else{
                    Toast(ret.errorMsg);
                }
            });
        }
    }




module.exports.Note = Note;