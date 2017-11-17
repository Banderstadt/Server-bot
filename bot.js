const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({disableEveryone: true});
const prefix = config.prefix;

bot.on("ready", async () => {
	console.log("Диванного бота активовано! ${bot.user.username}");
    
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch(e) {
        console.log(e.stack);
    }
});

bot.on("message", async message => {
//    if(!message.content.startsWith(prefix) || message.author.bot || message.author.id !== config.ownerID) return;
    
//    console.log("I can see the message");
    
//    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/g);
//    const command = args.shift().toLowerCase();
    
//    if(command === 'hello') {
//        message.channel.send('world!');
//    }

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
//    if(message.author.id !== config.ownerID) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    
    if(command === `${prefix}інфо`) {
        let embed = new Discord.RichEmbed()
            .setDescription("Ім’я користувача")
            
            .setColor("#00ccff")
            .addField("Користувач #", `${message.author.username}#${message.author.discriminator}`)
        .setAuthor(message.author.username)
            .addField("Ідентифікатор", message.author.id)
            .addField("Створено", message.author.createdAt);
        
        message.channel.send(embed);
        return;
    }
});

bot.login(config.token);


