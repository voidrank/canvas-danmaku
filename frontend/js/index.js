/**
 * Created by lancy on 9/22/15.
 */

$(function(){
    var randomSalt = "", userSalt = "";
    $(".form--login").submit(function(event){
        var uid = $("#login__username")[0].value,
            password = $("#login__password")[0].value,
            token = $("#login__token")[0].value;
        (function set_token() {
            $.ajax({
                type: "GET",
                url: "/canvas_danmaku/api/manager/get_salt?uid=" + uid,
                success: function (res) {
                    console.log(123);
                    randomSalt = res["randomSalt"];
                    userSalt = res["userSalt"];
                    password = CryptoJS.SHA512(password + userSalt).toString();
                    password = CryptoJS.SHA512(password + randomSalt).toString();
                    $.ajax({
                        type: "POST",
                        url: "/canvas_danmaku/api/manager/set_token",
                        data: JSON.stringify({
                            "uid": uid,
                            "password": password,
                            "token": token
                        }),
                        success: function (res) {
                            alert("success");
                        },
                        dataType: "json",
                        contentType: "application/json"
                    });
                },
                error: function (res) {
                    setTimeout(get_salt, 1000);
                }
            });
        })();
        event.preventDefault();
        event.stopPropagation();
    })
});
