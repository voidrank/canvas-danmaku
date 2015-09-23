/**
 * Created by lancy on 9/22/15.
 */

$(function(){
    $(".form--login").submit(function(event){
        var uid = $("#login__username")[0].value,
            password = $("#login__password")[0].value,
            captcha = $("#login__captcha")[0].value;
        $.ajax({
            type: "POST",
            url: "/canvas_danmaku/api/manager/register",
            data : JSON.stringify({
                "uid" : uid,
                "password" : password,
                "captcha": captcha
            }),
            success: function(res) {
                alert("success");
            },
            dataType: "json",
            contentType: "application/json"
        });
        event.preventDefault();
        event.stopPropagation();
    })
});
