var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Toast = require('./toast.js').Toast;
var Event = require('mod/event.js');
var $ = require('jquery')

var NoteManager = (function(){

    function load() {
        $.get('/api/notes')
            .done(function(ret){
                if(ret.status == 0){
$.each(ret.data, function(idx, article) {
                        new Note({
                            id: article.id,
                            context: article.text,
                            username: article.username || '神',
                        });
                        console.log(article.username)

                             $('.ps').on('mouseover',function () {
                            $(this).addClass('trg')
                            $(this).text('删除')
                        }).on('mouseout',function (e) {
                            $(this).removeClass('trg')
                            $(this).text('未完成')
                        })//注册监听

                    });

                    Event.fire('waterfall');
                }else{
                    Toast(ret.errorMsg);
                }
            })
            .fail(function(){
                Toast('网络异常');
            });


    }

    function add(){
        new Note();
        }


    return {
        load: load,
        add: add,
    }

})();

module.exports.NoteManager = NoteManager