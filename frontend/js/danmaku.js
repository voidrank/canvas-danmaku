/**
 *
 * Created by lancy on 9/20/15.
 */
$(function() {
    var canvas = document.getElementById("danmaku-wall");

    // windows settings
    var viewWidth = document.documentElement.clientWidth < 750 ? 750 : document.documentElement.clientWidth;
    var viewHeight = document.documentElement.clientHeight;
    canvas.width = viewWidth;
    canvas.height = viewHeight;
    canvas.style.width = viewWidth + "px";
    canvas.style.height = viewHeight * 0.8 + "px";

    var ctx = document.getElementById("danmaku-wall").getContext("2d");

    // danmaku settings
    var danmakuSettings = {
        "fontSize": 30,
        "speed": 3,
        "font": "serif",
        "channelSrc": "/canvas_danmaku/api/channel/lancy",
        "color": "#ffffff"
    };
    // danmaku list
    /*
     * {
     *  "content": String
     * }
     */
    var danmakuList = [];
    var danmakuOnScreen = [];

    function update(){

        // insert
        for (var i = 0; i < danmakuList.length; ++i) {
            var newDanmaku = {
                'x': viewWidth,
                'y': (parseInt(Math.random() * (viewHeight / danmakuSettings["fontSize"] - 1)) + 1)* danmakuSettings["fontSize"],
                'content': danmakuList[i].content
            };
            danmakuOnScreen.push(newDanmaku);
        }
        danmakuList = [];

        // delete
        for (var i = 0; i < danmakuOnScreen.length; ++i) {
            var danmaku = danmakuOnScreen[i];
            if (danmaku.x < -viewWidth) {
                danmakuOnScreen.splice(i, 1);
                --i;
            }
        }

        // update
        ctx.clearRect(0, 0, viewWidth, viewHeight);
        for (var i = 0; i < danmakuOnScreen.length; ++i) {
            danmaku = danmakuOnScreen[i];
            danmaku.x -= danmakuSettings['speed'];
            ctx.font = danmakuSettings['fontSize'] + 'px ' + danmakuSettings['font'];
            ctx.fontcolor = danmakuSettings["color"];
            ctx.fillText(danmaku.content, danmaku.x, danmaku.y);
        }

        window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(update);

    // network

    setInterval(function(res) {
        console.log(typeof danmakuSettings["channelSrc"]);
        $.get(
            danmakuSettings["channelSrc"],
            function(e) {
                if (e.response !== "adjust time") {
                    danmakuList = e.response;
                }
            }
        )
    }, 1000);

    setTimeout(function() {
        $(signal).trigger("danmakuSettingsResponse", danmakuSettings);
    }, 500);

    $(signal).on("danmakuSettingsRequest", function(e, data) {
        for (var i in data)
            if (data.hasOwnProperty(i)) {
                danmakuSettings[i] = data[i];
            }
        $("iframe").attr("src", danmakuSettings["iframeSrc"]);
    });

    //
    $(signal).on("se")
});
