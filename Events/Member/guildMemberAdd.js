// Logs whenever a user or a bot joins the guild

const { MessageEmbed, GuildMember } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member 
   */
  async execute(member) {
    const Data = await LogsSetupData.findOne({
      GuildID: member.guild.id,
    });
    if (!Data) return;
    
    const logChannel = member.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await member.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    if (log.action == "BOT_ADD") { // If the last entry fetched is of the type "BOT_ADD" it means a bot has joined
      const botJoinedEmbed = new MessageEmbed()
        .setTitle("<:icons_unbanmember:866943415321100289> A Bot Joined The Server")
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(member.guild.name)
        .setDescription(`> The bot ${member} has been added by \`${log.executor.tag}\` to this server`)

      await createAndDeleteWebhook(botJoinedEmbed) // executes the function bellow with as parameter the embed name
    } else { // Else it means a normal user joined
      const userJoinedEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("<:icons_unbanmember:866943415321100289> An User Just Joined The Server")
        .setTimestamp()
        .setFooter(member.guild.name)
        .setDescription(`> The user ${member} just joined the guild`)

      await createAndDeleteWebhook(userJoinedEmbed) // executes the function bellow with as parameter the embed name
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(member.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: member.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  }
}


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
