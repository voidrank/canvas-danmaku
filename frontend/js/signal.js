/**
 * Created by lancy on 9/23/15.
 */


signal = {};

// 鼠标进入指定区域， 弹出
$(signal).on("onSettings", function () {
    setTimeout(function() {
        $("#contact-form").css("display", "block");
    }, 500);
    $("#contact-form").css("transition", "opacity 0.5s ease").css("opacity", 1);
});

// 鼠标离开指定区域，弹回
$(signal).on("outSettings", function () {
    $("#contact-form").css("transition", "opacity 0.5s ease").css("opacity", 0);
    setTimeout(function(){
        $("#contact-form").css("display", "none");
    }, 500);
});

// 请求更改settings
$(signal).on("danmakuSettingsRequest", function(req) {
});

// 反向更改settings
$(signal).on("danmakuSettingsResponse", function(res) {

});

// 触发切换iframe
$(signal).on("toIframe", function(){
    $("iframe").css("display", "block");
});

// 触发切换默认背景
$(signal).on("toBackground", function() {
    $("iframe").css("display", "none");
});


// other
var onSettings = true;
$(function() {
    $("#setting-trigger").on("mousedown", function (e) {
        if (onSettings === true) {
            $(signal).trigger("outSettings");
            onSettings = false;
        }
        else {
            $(signal).trigger("onSettings");
            onSettings = true;
        }
        e.preventDefault();
    });
});
