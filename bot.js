const Discord = require("discord.js");

const bot = new Discord.Client();

const config = require("./config.json");

bot.on("ready", function(){
	console.log("Я бот і я тут!");
});

bot.on("message", (message) => {
    if (!message.content.startsWith(config.PREFIX) || message.author.bot || message.author.id !== config.ownerID) return;
    
    //console.log("I can see the message");
    
    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === 'hello') {
        message.channel.send('world!');
    }
    
});

bot.login(config.TOKEN);


