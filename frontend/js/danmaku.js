/**
 *
 * Created by lancy on 9/20/15.
 */
$((function() {
    var canvas = document.getElementById("danmaku-wall");
    console.log(document.body);

    // windows settings
    var viewWidth = document.documentElement.clientWidth < 750 ? 750 : document.documentElement.clientWidth;
    var viewHeight = document.documentElement.clientHeight;
    canvas.width = viewWidth;
    canvas.height = viewHeight;
    canvas.style.width = viewWidth + "px";
    canvas.style.height = viewHeight + "px";

    var ctx = document.getElementById("danmaku-wall").getContext("2d");

    // danmaku settings
    var danmakuSettings = {
        "fontSize": 30,
        "speed": 3,
        "font": "serif",
        "channelSrc": "http://stu.fudan.edu.cn/canvas_danmaku/api/channel/lancy"
    };
    $(signal).on("danmakuSettingsRequest", function(e, req){
        if (!(req === null || req === undefined)) {
            for (var i in req)
                if (req.hasOwnProperty(i)) {
                    danmakuSettings[i] = req[i];
                }
            if (req.hasOwnProperty("iframeSrc"))
                $("#iframe").attr("src", req["iframeSrc"]);
        }
        $(signal).trigger("danmakuSettingsResponse", danmakuSettings);
    });
    // danmaku list
    /*
     * {
     *  "content": String
     * }
     */
    var danmakuList = [
        {
            "content": "明天会更好",
        },
        {
            "content": "明天会更好",
        },
        {
            "content": "明天会更好",
        },
        {
            "content": "明天会更好",
        },
        {
            "content": "明天会更好",
        },
        {
            "content": "明天会更好",
        }
    ];
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
            ctx.font = danmakuSettings['fontSize'] + 'px ' + danmakuSettings['font']
            ctx.fillText(danmaku.content, danmaku.x, danmaku.y);
        }

        window.requestAnimationFrame(update)
    };

    window.requestAnimationFrame(update);

    // network

    setInterval(function(res) {
        console.log(typeof danmakuSettings["channelSrc"])
        $.get(
            danmakuSettings["channelSrc"],
            function(e) {
                if (e.response !== "adjust time") {
                    danmakuList = e.response;
                }
            }
        )
    }, 1000);
})
);
