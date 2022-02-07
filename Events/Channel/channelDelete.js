// Logs whenever a channel is deleted

const { MessageEmbed, Channel } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "channelDelete",
  /**
   * @param {Channel} channel
   */
  async execute(channel) {
    const Data = await LogsSetupData.findOne({
      GuildID: channel.guild.id,
    });
    if (!Data) return;
    
    if (channel.type == "DM" || channel.type == "GROUP_DM") return

    const logChannel = channel.guild.channels.cache.get(Data.LogsChannel); 

    const logs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_DELETE"
    })
    const log = logs.entries.first(); // Fetches the audit logs and takes the last entry of type "CHANNEL_DELETE"

    if (log) { // If log exists executes code and creates embed
      const channelDeleteEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`<:icons_deletechannel:866943415396990987> A Channel Has Been Deleted`)
        .setTimestamp()
        .setFooter(channel.guild.name)
        .setDescription(`> The channel \`${channel.name}\` has been deleted by \`${log.executor.tag}\``)
        .addField("Type", `\`${channel.type.slice(6).toLowerCase().replaceAll("_", " ")}\``)

      if (channel.type !== "GUILD_CATEGORY") { // If type is different than category adds the parent
        channelDeleteEmbed.addField("Parent category", channel.parentId ? `\`${channel.parent.name}\`` : "No parent channel")
      }

      await createAndDeleteWebhook(channelDeleteEmbed); //executes the function bellow with as parameter the embed name
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(channel.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: channel.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed and transcript file through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  }
}


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
