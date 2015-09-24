/**
 * Created by lancy on 9/22/15.
 */

$(function () {
    $(".form--login").submit(function (event) {
        var uid = $("#login__username")[0].value,
            password = $("#login__password")[0].value,
            captcha = $("#login__captcha")[0].value;
        $.ajax({
            type: "POST",
            url: "/canvas_danmaku/api/manager/register",
            data: JSON.stringify({
                "uid": uid,
                "password": password,
                "captcha": captcha
            }),
            success: function (res) {
                alert("success");
                window.location.href = "/canvas_danmaku/frontend/index.html";
            },
            error: function (res) {
                alert(res.status);
            },
            dataType: "json",
            contentType: "application/json"
        })
            .always(function () {
                $("#captcha__image").attr("src", "/canvas_danmaku/api/manager/captcha" + "?time=" + new Date().getTime());
            });
        event.preventDefault();
        event.stopPropagation();
    })
});
