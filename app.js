"use strict";

var tmi = require("tmi.js");

var client = new tmi.client({
	options: {
		debug: true
	},
    identity: {
        username: "chilaxbot",
        password: "oauth:b5ygpca0ukms48qls0fhk2p1zlwkg3"
    },
    channels: ["#chilaxdota"]
});

client.on("join", function (channel, username, self) {
	console.log("new user joined " + username);
});

client.on("part", function (channel, username, self) {
	console.log("new user parted " + username);
});

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
	client.say("chilaxdota", "ok " + userstate['display-name']);
});

client.connect();

var currency_amount = 1,
handout_timer = 300000;

var db = new (require('./lib/mysql.js'))({
	host     : "dd18504.kasserver.com",
	user     : "d02abff8",
	password : "GV9otLHEb6eUs72q",
	database : "d02abff8"
});
var api = new (require('./lib/api.js'))(db);

function insert_coins() {
    api.get_chatters().then((chatters) => {
        console.log("Active chatters: ");
        console.log(chatters);
    
        var sql = '';
        for (var i = 0; i < chatters.length; i++) {
            if (chatters[i] !== '') {
                if (i != chatters.length - 1) {
                    sql += 'INSERT INTO viewers (name, points) ';
                    sql += 'VALUES (\'' + chatters[i] + '\', ' + currency_amount + ') ';
                    sql += 'ON DUPLICATE KEY UPDATE points = points + ' + currency_amount + '; ';
                } else {
                    sql += 'INSERT INTO viewers (name, points) ';
                    sql += 'VALUES (\'' + chatters[i] + '\', ' + currency_amount + ') ';
                    sql += 'ON DUPLICATE KEY UPDATE points = points + ' + currency_amount;
                }
            }
        }
    
        db.execute(sql).then(() => {
            console.log("Succesfully added points to all users in chat.");

            //Repeat all 5 minutes
            setTimeout(insert_coins, handout_timer);
        });
    });
}

db.start().then(() => {
    insert_coins();
});