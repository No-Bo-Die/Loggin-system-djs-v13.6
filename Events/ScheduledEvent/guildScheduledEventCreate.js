// Logs whenever a guild event is created

const { MessageEmbed, GuildScheduledEvent, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildScheduledEventCreate",
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

    const guildScheduledEventCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_scheduleevent:866943416021811200> A Scheduled Event Has Been Created")
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(guildScheduledEvent.guild.name)


    if (log.action == "GUILD_SCHEDULED_EVENT_CREATE") { // If entry of the type "GUILD_SCHEDULED_EVENT_CREATE" is existing executes code
      guildScheduledEventCreateEmbed.setDescription(`> The scheduled event \`${guildScheduledEvent.name}\` has been created by \`${log.executor.tag}\``)
        .addFields(
          {
            name: "Channel",
            value: guildScheduledEvent.channelId ? `<#${guildScheduledEvent.channelId}>` : "No channel"
          },
          {
            name: "Description",
            value: guildScheduledEvent.description ? `\`${guildScheduledEvent.description}\`` : "No description"
          },
          {
            name: "Type",
            value: `\`${guildScheduledEvent.entityType.toLowerCase().replace("_", " ")}\``,
            inline: true
          },
          {
            name: "Location",
            value: guildScheduledEvent.entityMetadata != null ? `\`${guildScheduledEvent.entityMetadata.location}\`` : "No external location",
            inline: true
          },
          {
            name: "Privacy",
            value: `\`${guildScheduledEvent.privacyLevel.toLowerCase().replace("_", " ")}\``,
            inline: true
          },
          {
            name: "Starts at",
            value: `<t:${parseInt(guildScheduledEvent.scheduledStartTimestamp / 1000)}:R>`,
            inline: true
          },
          {
            name: "Ends at",
            value: guildScheduledEvent.scheduledEndTimestamp ? `<t:${parseInt(guildScheduledEvent.scheduledEndTimestamp / 1000)}:R>` : "No end",
            inline: true
          },
          {
            name: "URL",
            value: guildScheduledEvent.url
          }
        )

      await createAndDeleteWebhook(guildScheduledEventCreateEmbed) // executes the function bellow with as parameter the embed name
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
