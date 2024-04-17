
const { EmbedBuilder,PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { post } = require("node-superfetch");
const {Guild} = require("../../../../Global/Config/Guild")
const afksystem = require("../../../../Global/Database/SystemDB/afk")
class Afk extends Command {
    constructor(client) {
        super(client, {
            name: "Afk",
            description: "Otomatik Yetki atlama sistemini kurar",
            usage: ".afk",
            category: "Global",
            aliases: ["afk"],

            enabled: true,
 
            });
    }
async onRequest (client, message, args,embed) {
const afkDB = await afksystem.findOne({gulildID:message.guild.id,userID:message.member.id});
const only = afkDB ? afkDB.only : false
if(!afkDB || only == false) {
var sebep = args.splice(0).join(" ");
if(!sebep) sebep = "Seni hiç alakadar etmez!";
await afksystem.findOneAndUpdate({guildID:message.guild.id, userID:message.member.id},{$set:{only:true,date:Date.now(),reason:sebep}},{upsert:true})
message.reply({embeds:[embed.setDescription(`${message.member}, <t:${(Date.now()/1000).toFixed()}:R> **"${sebep}"** sebebiyle __AFK__ moduna girdin!`)]}).then(async msg => {
setTimeout(async() => {
if(message) await message.delete();
if(msg) await msg.delete();
}, 5000);
})
} else {
await afksystem.findOneAndDelete({guildID:message.guild.id,userID:message.member.id});
message.reply({content:"AFK Modundan çıktınız!"}).then(async msg => {
    setTimeout(async() => {
    if(message) await message.delete();
    if(msg) await msg.delete();
    }, 5000);
    })
}
}
}
module.exports = Afk;