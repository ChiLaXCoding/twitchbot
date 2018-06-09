const _ = require('lodash')
const axios = require('axios');

class API {
	constructor(db) {
		this.db = db;
	}
	
	get_chatters() {
		let streamers = [];
		let requests = [];

		return this.db.execute("SELECT * FROM streamers").then((results) => {
			streamers = results;

			for (var i = 0; i < streamers.length; i++) {
				let url = 'http://tmi.twitch.tv/group/user/$/chatters'.replace('$', streamers[i].name);
				requests.push(axios.get(url));
			}
			
			return Promise.all(requests).then((responses) => { 
				let chatters = [];
				
				for (var i = 0; i < responses.length; i++) {
					chatters = chatters.concat(
					responses[i].data["chatters"]["moderators"],
					responses[i].data["chatters"]["viewers"]);
				}
				
				chatters = _.uniq(chatters)
				
				return chatters;
			}).catch(error => {
				console.log(error);
				
				return Promise.reject();
			});
		});
	}
}

module.exports = API;
