const Discord = require("discord.js");


var bot = new Discord.Client();

const PREFIX = "!";

bot.on("ready", function(){
	console.log("Я бот і я тут!")
})	

bot.on("message", function(message) {
	if(message.author.equals(bot.user)) return;

	var args = message.content.substring(PREFIX.length).split(" ");

	switch(args[0].toLowerCase()) {
		case "hello":
		message.channel.sendMessage("world");
		break;
	}

});

bot.login(TOKEN);


