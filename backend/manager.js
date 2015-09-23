/**
 * Created by lancy on 9/22/15.
 */

var router = require("koa-router"),
    bodyParser = require("koa-bodyparser"),
    db = require("./db");

var ManagerAPI = new router();

exports = module.exports = ManagerAPI;

ManagerAPI
    .use(bodyParser())
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
            typeof userJSON["uid"] === "string" &&
            typeof userJSON["password"] == "string") {
            var user = yield db.user.findOne({"uid": userJSON["uid"]});
            if (user !== null) {
                this.status = 406;
                this.body = {
                    "reason": "This uid has been occupied."
                }
            }
            else {
                yield db.user.insert({
                    "uid": userJSON["uid"],
                    "password": userJSON["password"]
                });
                this.body = "successfully";
            }
        }
        else {
            this.status = 406;
            this.body = {
                "reason": "bad form"
            }
        }
    })
    .post("/manager/set_token", function * (next) {
        userJSON = this.request.body;
        console.log(this.request.body);
        if (userJSON.hasOwnProperty("password") &&
            userJSON.hasOwnProperty("token") &&
            userJSON.hasOwnProperty("uid") &&
            typeof userJSON["password"] === "string" &&
            typeof userJSON["token"] === "string" &&
            typeof userJSON["uid"] === "string") {

            var user = yield db.user.findOne({"uid" : userJSON["uid"], "password": userJSON["password"]});
            console.log(user);
            if (user !== null) {
                user["verification"] = false;
                user["token"] = userJSON["token"];
                yield db.user.update({"_id": user["_id"]}, user);
                this.body = "successfully";
            }
            else {
                this.status = 403;
            }
        }
        else {
            this.status = 406;
        }
    });
