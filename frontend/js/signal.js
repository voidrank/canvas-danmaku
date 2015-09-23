/**
 * Created by lancy on 9/23/15.
 */


signal = {};

// 鼠标进入指定区域， 弹出
$(signal).on("pull", function () {

});

// 鼠标离开指定区域，弹回
$(signal).on("push", function () {

});

$(signal).on("danmakuSettingsRequest", function(req) {

});

$(signal).on("danmakuSettingsResponse", function(res) {

});

$(function() {
    $(document.body).mousemove(function (e) {
        var width = document.documentElement.clientWidth;
        if (e.pageX > width - 100) {
            $(signal).trigger("pull");
        }
        else if (e.pageX < width - 300){
            $(signal).trigger("push");
        }
    });
});


