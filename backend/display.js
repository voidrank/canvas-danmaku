/**
 * Created by lancy on 9/22/15.
 */

var router = require("koa-router"),
    bodyParser = require("koa-bodyparser"),
    db = require("./db");

var DisplayAPI = new router();

exports = module.exports = DisplayAPI;

DisplayAPI
    .use(bodyParser())
    .get("/channel/:channel/", function *(next) {
        var time = new Date().getTime();
        var lastTime = this.session.lastTime;
        if (lastTime === undefined ||
            time - lastTime > 600000 ||
            lastTime > time) {
            this.session.lastTime = time;
            this.body = {"response": "adjust time"};
        }
        else {
            /* for test
             yield db.danmaku.insert({
             "content" : "123",
             "channel" : this.params.channel,
             "timestamp" : time
             });
             */
            this.body = {
                "now": time,
                "lastTime": this.session.lastTime,
                "response": yield db.danmaku.find({
                    "timestamp": {"$gt": lastTime, "$lte": time},
                    "channel": this.params.channel
                })
            };
            this.session.lastTime = time;
        }
    });
