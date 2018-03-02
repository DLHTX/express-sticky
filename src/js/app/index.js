require('less/index.less')
var $ = require('jquery')
var Toast = require('../mod/toast.js').Toast
var NoteManager = require('../mod/note-manager.js').NoteManager;
var Event = require('../mod/event.js');
var WaterFall = require('../mod/waterfall.js');

NoteManager.load();


$('.add-note').on('click', function() {
    NoteManager.add();
    WaterFall.init($('#content'));

    $('.ps').on('mouseover',function () {
        $(this).addClass('trg')

    }).on('mouseout',function (e) {
        $(this).removeClass('trg')

    })
})

Event.on('waterfall', function(){
    WaterFall.init($('#content'));
})



