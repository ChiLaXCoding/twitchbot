/*
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

var viewers = [];

function showViewers() {
	console.clear();
	
	for (var i = 0; i < viewers.length; i++) {
		console.log(viewers.length);
		console.log(viewers[i]);
	}
}

client.on('connected', function(address, port) {
	//client.say("chilaxdota", "chilaxbot connected.");
	
	setInterval(showViewers, 100);
});

client.on("join", function (channel, username, self) {
	if (viewers.indexOf(username) < 0) {
		viewers.push(username);
		console.log("new user joined");
	}
});

client.on("part", function (channel, username, self) {
	var index = viewers.indexOf(username);
	if (index > -1) {
		viewers.splice(index, 1);
		console.log("user left");
	}
});

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
	client.say("chilaxdota", "ok " + userstate['display-name']);
});

client.connect();
*/

"use strict";

var api = new (require('./lib/api.js'))();

api.get_chatters([ "chilaxdota", "chilady", "5up__" ]).then((chatters) => {
	console.log(chatters);
});


