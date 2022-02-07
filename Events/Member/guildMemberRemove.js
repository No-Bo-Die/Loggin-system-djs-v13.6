// Logs whenever a member gets kicked, prunned or just leaves normally

const { MessageEmbed, GuildMember } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildMemberRemove",
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

    const memberLeftEmbed = new MessageEmbed()
      .setTitle("<:icons_banmembers:866943415361732628> A Member Left the guild")
      .setColor("RED")
      .setTimestamp()
      .setFooter(member.guild.name)

    if (log.action == "MEMBER_KICK") { // If the last entry fetched is of the type "MEMBER_KICK" it means the member got prunned out of the server
      memberLeftEmbed.setDescription(`> The member \`${log.target.tag}\` has been kicked from this guild by \`${log.executor.tag}\``)
      if (log.reason) memberLeftEmbed.addField("Reason:", `\`${log.reason}\``)

      return await createAndDeleteWebhook(memberLeftEmbed); // executes the function bellow with as parameter the embed name
    } else if (log.action == "MEMBER_PRUNE") { // If the last entry fetched is of the type "MEMBER_PRUNE" it means the member got prunned out of the server
      memberLeftEmbed.setDescription(`> The member \`${log.target.tag}\` has been prunned from this guild by \`${log.executor.tag}\``)
      if (log.reason) memberLeftEmbed.addField("Reason:", `\`${log.reason}\``)

      return await createAndDeleteWebhook(memberLeftEmbed); // executes the function bellow with as parameter the embed name
    } else { // Else it means the member left normally
      memberLeftEmbed.setDescription(`> The member \`${member.user.tag}\` left the server`)

      return await createAndDeleteWebhook(memberLeftEmbed); // executes the function bellow with as parameter the embed name
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
