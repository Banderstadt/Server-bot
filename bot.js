const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({});
const prefix = config.prefix;
const fs = require("fs");

bot.mutes = require("./mutes.json");

bot.on("ready", async () => {
	console.log(`Диванного бота активовано! ${bot.user.username + " чекає вашої команди!"}`);
	bot.setInterval( () => {
		for(let i in bot.mutes) {
			let time = bot.mutes[i].time;
			let guildId = bot.mutes[i].guild;
			let guild = bot.guilds.get(guildId);
			let member = guild.members.get(i);
			let mutedRole = guild.roles.find(r => r.name === "Заглушені");
			if(!mutedRole) continue;

			if(Date.now() > time) {
				console.log(`${i} вже може бути розглушений`);

				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
					if(err) throw err;
					console.log(`Я розглушив ${member.user.tag}.`);
				});
			}
		}
	}, 5000)

	// Bot invite generator
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch(e) {
        console.log(e.stack);
    }
    // The end of bot invite generator
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.author.id !== config.ownerID) return message.channel.send("У вас недостатньо прав!");

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    
	// Command that shows information about user
    if(command === `${prefix}інфо`) {
        let embed = new Discord.RichEmbed()
            .setColor("#00ccff")
            .addField("Ім’я користувача", `${message.author.username}`)
            .addField("Користувач #", `${message.author.username}#${message.author.discriminator}`)
            // .setAuthor(message.author.username)
            .addField("Ідентифікатор", message.author.id)
            .addField("Створено", message.author.createdAt);
        message.channel.send(embed);
        return;
        
    }
    // The end of the userinfo command

    // Start of the mute user command
    if(command === `${prefix}заглушити`) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("У Вас немає доступу до керування повідомленнями.");
        
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send("Ви не вказалали користувача чи його ідентифікатор");
        
       	if(toMute.id === message.author.id) return message.channel.send("Ви не можете себе заглушити");
       	if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("Ви не можете заглушити користувача з більшим чи таким самим пріоритетом, ніж у вас."); 
       		
        
        let role = message.guild.roles.find(r => r.name === "Заглушені");
        if(!role) {
            try {
                role = await message.guild.createRole({
                    name: "Заглушені",
                    color: "#000000",
                    permissions: []
                });
                message.guild.channels.forEach(async (channel, id) => { 
                    await channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch(e) {
                console.log(e.stack);
            }
        }
        
        if(toMute.roles.has(role.id)) return message.channel.send("Цей користувач вже заглушений!");

        await toMute.addRole(role);

        bot.mutes[toMute.id] = {
        	guild: message.guild.id,
        	time: Date.now() + parseInt(args[1]) * 1000
        }

        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
        	if(err) throw err;
        	message.channel.send("Я заглушив цього зрадника!")
        });
        
        return;

 		}
   	// The end of the mute command
    
    // Start of the unmute command
    if(command === `${prefix}розглушити`) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("У вас не достатньо прав!");
        
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send("Ви не вказалали користувача чи його ідентифікатор");
        
        let role = message.guild.roles.find(r => r.name === "Заглушені");
        if(!role || !toMute.roles.has(role.id)) return message.channel.send("Користувач не є заглушений");
        
        await toMute.removeRole(role);

        delete bot.mutes[toMute.id];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
					if(err) throw err;
					console.log(`Я розглушив ${toMute.user.tag}.`);
				});

        return;
    }
    // The end of the unmute command
});

bot.login(config.token);

