/**
 * Created by lancy on 9/22/15.
 */

var monk = require("monk"),
    wrap = require("co-monk");

// models
var database = monk("localhost/canvasDanmaku");
var db = {
    danmaku: wrap(database.get("danmaku")),
    user: wrap(database.get("user"))
};

module.exports = db;
