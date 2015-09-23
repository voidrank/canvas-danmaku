/**
 * Created by lancy on 9/21/15.
 *
 *
 * TODO: file splite, anti-csrf, anti-css, user-manager
 */

var app = require("koa")(),
    session = require("koa-session"),
    DisplayAPI = require("./display"),
    ManagerAPI = require("./manager"),
    WeChatAPI = require("./wechat");
require("koa-qs")(app, 'strict');



// settings


app.keys = ["stu2015stu"];

app
    .use(function * (next) {
        console.log(this.url);
        yield next;
    })
    .use(session(app)) // session middleware
    .use(DisplayAPI.routes())
    .use(DisplayAPI.allowedMethods())
    .use(ManagerAPI.routes())
    .use(ManagerAPI.allowedMethods())
    .use(WeChatAPI.routes())
    .use(WeChatAPI.allowedMethods());

app.listen(3000);



