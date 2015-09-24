/**
 * Created by lancy on 9/22/15.
 */

var router = require("koa-router"),
    bodyParser = require("koa-bodyparser"),
    db = require("./db"),
    ccap = require("ccap"),
    crypto = require("crypto");

var ManagerAPI = new router();

exports = module.exports = ManagerAPI;

ManagerAPI
    .use(bodyParser())
    .get("/manager/captcha", function * (next) {
        var captcha = ccap();
        var ary = captcha.get();
        this.session.captcha = ary[0];
        var buffer = ary[1];
        this.body = buffer;
    })
    .post("/manager/login", function * (next) {
        userJSON = this.request.body;
        user = yield db.user.findOne({
                "uid": userJSON["uid"],
                "password": userJSON["password"]
            }
        );
        if (user === null) {
            this.body = "failed";
            this.status = 403;
        }
        else {
            this.body = "successful";
            this.session.user = user;
        }
    })
    .post("/manager/register", function * (next) {
        userJSON = this.request.body;
        if (userJSON.hasOwnProperty("uid") &&
            userJSON.hasOwnProperty("password") &&
            userJSON.hasOwnProperty("captcha") &&
            typeof userJSON["uid"] === "string" &&
            typeof userJSON["password"] === "string" &&
            typeof userJSON["captcha"] === "string" &&
            typeof this.session.captcha === "string" &&
            userJSON["captcha"] === this.session.captcha
            ) {
            var user = yield db.user.findOne({"uid": userJSON["uid"]});
            if (user !== null) {
                this.status = 406;
                this.body = {
                    "reason": "This uid has been occupied."
                }
            }
            else {
                var salt = crypto.randomBytes(128).toString("base64");
                var password = crypto.createHash("sha512").update(userJSON["password"] + salt).digest("hex");
                yield db.user.insert({
                    "uid": userJSON["uid"],
                    "password": password,
                    "salt": salt
                });
                this.body = {"response":"success"};
            }
        }
        else {
            this.status = 406;
            this.body = {
                "reason": "bad form"
            }
        }
        this.session.captcha = null;
    })
    .post("/manager/set_token", function * (next) {
        userJSON = this.request.body;
        if (userJSON.hasOwnProperty("password") &&
            userJSON.hasOwnProperty("token") &&
            userJSON.hasOwnProperty("uid") &&
            typeof userJSON["password"] === "string" &&
            typeof userJSON["token"] === "string" &&
            typeof userJSON["uid"] === "string") {

            var user = yield db.user.findOne({"uid" : userJSON["uid"]})
            if (user === null || this.session.salt === null)
                this.status = 403;
            else {
                var hashPassword = crypto.createHash("sha512").update(user["password"] + this.session.salt).digest('hex');
                if (hashPassword !== userJSON["password"]) {
                    this.status = 403;
                }
                else {
                    user["verification"] = false;
                    user["token"] = userJSON["token"];
                    yield db.user.update({"_id": user["_id"]}, user);
                    this.body = "successfully";
                }
            }
        }
        else {
            this.status = 406;
        }
        this.session.salt = null;
    })
    .get("/manager/get_salt", function * (next) {
        var randomSalt = crypto.randomBytes(128).toString("base64");
        var user = yield db.user.findOne({"uid": this.query.uid[0]});
        if (user === null) {
            this.status = 406;
        }
        else {
            this.session.salt = randomSalt;
            this.body = {
                "randomSalt": randomSalt,
                "userSalt": user["salt"]
            }
        }
    });
