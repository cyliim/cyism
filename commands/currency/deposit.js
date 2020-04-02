const db = require("quick.db");
const Discord = require("discord.js");
module.exports = {
        run: async(client, message, args) => {
                try {
                    let prefix = db.get(`guildPrefix_${message.guild.id}`);
                    let money = db.get(`memberCurrency_${message.member.user.id}_${message.guild.id}`);
                    let bank = db.get(`memberBank_${message.member.user.id}_${message.guild.id}`);
                    if (!args[0]) return message.channel.send(new Discord.MessageEmbed().setTitle("deposit").setDescription(`${prefix}deposit <amount> - adds a specified amount of money to your bank \n ${prefix}deposit all - deposits all money to bank`));
                    if (args[0] > money) return message.channel.send("you don't have enough money to do this");
                    if (args[0] == "all".toLowerCase()) {
                        message.channel.send(`deposited $\`${db.get(`memberCurrency_${message.member.user.id}_${message.guild.id}`)}\` to bank`);
                        await db.subtract(`memberCurrency_${message.member.user.id}_${message.guild.id}`, money);
                        await db.add(`memberBank_${message.member.user.id}_${message.guild.id}`, money);
            } else {
                await db.subtract(`memberCurrency_${message.member.user.id}_${message.guild.id}`, args[0]);
                await db.add(`memberBank_${message.member.user.id}_${message.guild.id}`, args[0]);
                message.channel.send(`deposited $\`${args[0]}\` to bank`);
            }
        } catch (err) {
            message.channel.send("enter a number or `all` rather than something else");
        }

    },
    aliases: ["dep"]
}