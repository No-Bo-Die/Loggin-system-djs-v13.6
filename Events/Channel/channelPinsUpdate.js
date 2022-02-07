// Logs whenever a message is pinned/unpinned in a channel

const { Client, MessageEmbed, Channel } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "channelPinsUpdate",
  /**
   * @param {Channel} channel
   */
  async execute(channel, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: channel.guild.id,
    });
    if (!Data) return;
    
    const logChannel = channel.guild.channels.cache.get(Data.LogsChannel);

    const logs = await channel.guild.fetchAuditLogs({
      limit: 1,
    });
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const channelPinsChangeEmbed = new MessageEmbed()
      .setTitle("<:icons_updatemember:866943416256167936> A Channel's Pins Has Been Updated")
      .setTimestamp()
      .setFooter(channel.guild.name);

    if (!log.target || log.target.bot) return; // If there is no target defined or the target is a bot returns (if you want messages pinned sent by bots logged you can remove (|| log.target.bot) but not the first part)

    if (log.action == "MESSAGE_PIN") { // If the last entry fetched is of the type "MESSAGE_PIN" executes the code
      channelPinsChangeEmbed.setColor("GREEN").setDescription(`> A message by \`${log.target.tag}\` has been pinned in ${channel} by \`${log.executor.tag}\``)
    }

    if (log.action == "MESSAGE_UNPIN") {// If the last entry fetched is of the type "MESSAGE_UNPIN" executes the code
      channelPinsChangeEmbed.setColor("RED").setDescription(`> A message by \`${log.target.tag}\` has been unpinned from ${channel} by \`${log.executor.tag}\``)
    }

    await createAndDeleteWebhook(channelPinsChangeEmbed); // executes the function bellow with as parameter the embed name

    async function createAndDeleteWebhook(embedName) { // Creates a webhook in the logging channel specified before
      await logChannel.createWebhook(channel.guild.name, {
        avatar: channel.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  },
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
