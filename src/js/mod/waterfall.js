var $ = require('jquery')

var WaterFall = (function(){
    var $ct;
    var $items;

    function render($c){
        $ct = $c;
        $items = $ct.children();
        var nodeWidth = $items.outerWidth(true),
            index = Math.floor($c.width()/nodeWidth)
        var sz = []
        for(var i=0;i<index;i++){
            sz[i]= 0
        }
        $items.each(function () {
            var minValue = sz[0]
            var minIndex = 0
            for(var i=0;i<index;i++){
                if(sz[i]<minValue){
                    minValue = sz[i]
                    minIndex = i
                }
            }

            $(this).css({
                left:minIndex * $(this).outerWidth(true),
                top:minValue
            })
            sz[minIndex] = $(this).outerHeight(true) + sz[minIndex]
        })
        // $ct = $c;
        // $items = $ct.children();
        //
        // var nodeWidth = $items.outerWidth(true),
        //     colNum = parseInt($c.width()/nodeWidth),
        //     colSumHeight = [];
        //
        // for(var i = 0; i<colNum;i++){
        //     colSumHeight.push(0);
        // }
        //
        // $items.each(function(){
        //     var $cur = $(this);
        //
        //     //colSumHeight = [100, 250, 80, 200]
        //
        //     var idx = 0,
        //         minSumHeight = colSumHeight[0];
        //
        //     for(var i=0;i<colSumHeight.length; i++){
        //         if(colSumHeight[i] < minSumHeight){
        //             idx = i;
        //             minSumHeight = colSumHeight[i];
        //         }
        //     }
        //
        //     $cur.css({
        //         left: nodeWidth*idx,
        //         top: minSumHeight
        //     });
        //     colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];

    }


    $(window).on('resize', function(){
        render($ct);
    })


    return {
        init: render
    }
})();

module.exports = WaterFall