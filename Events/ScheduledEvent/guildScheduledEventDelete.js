// Logs whenever a guild event is deleted
// ❗ new `GUILD_SCHEDULED_EVENTS` intent needed to work ❗

const { MessageEmbed, GuildScheduledEvent, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildScheduledEventDelete",
  /**
   * @param {GuildScheduledEvent} guildScheduledEvent
   */
  async execute(guildScheduledEvent, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: guildScheduledEvent.guild.id,
    });
    if (!Data) return;
    
    const logChannel = guildScheduledEvent.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await guildScheduledEvent.guild.fetchAuditLogs({
      limit: 1
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const guildScheduledEventDeleteEmbed = new MessageEmbed()
      .setTitle("<:icons_deleteevent:866943416226152468> A Scheduled Event Has Been Deleted")
      .setColor("RED")
      .setTimestamp()
      .setFooter(guildScheduledEvent.guild.name)


    if (log.action == "GUILD_SCHEDULED_EVENT_DELETE") { // If entry of the type "GUILD_SCHEDULED_EVENT_DELETE" is existing executes code
      guildScheduledEventDeleteEmbed.setDescription(`> The scheduled event \`${guildScheduledEvent.name || "No old channel"}\` has been deleted by \`${log.executor.tag}\``)
        .addField("Channel", guildScheduledEvent.channelId ? `<#${guildScheduledEvent.channelId}>` : "No channel")

      await createAndDeleteWebhook(guildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(guildScheduledEvent.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: guildScheduledEvent.guild.iconURL({ format: "png" })
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
