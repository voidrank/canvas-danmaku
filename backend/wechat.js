/**
 * Created by lancy on 9/22/15.
 */

var router = require("koa-router"),
    bodyParser = require("koa-bodyparser"),
    db = require("./db"),
    raw = require('raw-body'),
    parseXML = require("xml2js").parseString,
    crypto = require("crypto");


// parser
function coXML(req, opts) {
    req = req.req || req;
    var type = (req.headers["content-type"] || '').split(';')[0];
    return function (done) {
        raw(req, opts, function (err, str) {
            if (err) return done(err);
            try {
                // Parse XML request
                parseXML(str, function (err, result) {
                    if (err) throw err;
                    done(null, result);
                });
            } catch (err) {
                err.status = 400;
                err.body = str;
                done(err);
            }
        });
    };
}

var WeChatAPI = new router();

exports = module.exports = WeChatAPI;


WeChatAPI
    .use(function * (next) { // verify
        var signature = this.query["signature"][0],
            timestamp = this.query["timestamp"][0],
            nonce = this.query["nonce"][0],
            token = (yield db.user.findOne({
                "uid": this.params.uid
            })).token;

        var list = [token, timestamp, nonce];
        list.sort();
        var str = list[0] + list[1] + list[2];
        var sha1 = crypto.createHash("sha1");
        var hash_str = sha1.update(str).digest("hex");
        if (hash_str === signature) {
            yield next;
        }
        else {
            this.status = 403;
        }
    })
    .post("/wechat/:uid", function * (next) {
        var channel = this.params.uid;
        var timestamp = new Date().getTime();
        var body = yield coXML(this);
        var content = body.xml.Content[0];
        yield db.danmaku.insert({
            "channel" : channel,
            "content" : content,
            "timestamp" : timestamp
        });
        this.body = "success";
    })
    .get("/wechat/:uid", function * (next) {
        yield db.user.update({"uid": this.params.uid}, {"varidation": true});
        this.body = this.query.echostr[0];
    });
