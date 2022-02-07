// Logs whenever a scheduled event url, channel, description, location, type, status, start time, end time changed
// ❗ new `GUILD_SCHEDULED_EVENTS` intent needed to work ❗

const { MessageEmbed, GuildScheduledEvent, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildScheduledEventUpdate",
  /**
   * @param {GuildScheduledEvent} oldGuildScheduledEvent
   * @param {GuildScheduledEvent} newGuildScheduledEvent
   */
  async execute(oldGuildScheduledEvent, newGuildScheduledEvent, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: oldGuildScheduledEvent.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldGuildScheduledEvent.guild.channels.cache.get(Data.LogsChannel);
    const logs = await oldGuildScheduledEvent.guild.fetchAuditLogs({
      limit: 1
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const oldGuildScheduledEventDeleteEmbed = new MessageEmbed()
      .setTitle("<:icons_updateevent:866943415614046266> A Scheduled Event Has Been Updated")
      .setColor("ORANGE")
      .setTimestamp()
      .setFooter(oldGuildScheduledEvent.guild.name)


    if (log.action == "GUILD_SCHEDULED_EVENT_UPDATE") { // If last entry is of the type "GUILD_SCHEDULED_EVENT_DELETE" executes code
      if (oldGuildScheduledEvent.url !== newGuildScheduledEvent.url) { // If url changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The url of \`${oldGuildScheduledEvent.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old url",
              value: oldGuildScheduledEvent.url
            },
            {
              name: "New url",
              value: newGuildScheduledEvent.url
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldGuildScheduledEvent.channelId !== newGuildScheduledEvent.channelId) { // If channel changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The channel of \`${oldGuildScheduledEvent.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old channel",
              value: oldGuildScheduledEvent.channelId ? `<#${oldGuildScheduledEvent.channelId}>` : "No channel before"
            },
            {
              name: "New channel",
              value: newGuildScheduledEvent.channelId ? `<#${newGuildScheduledEvent.channelId}>` : "No new channel"
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldGuildScheduledEvent.description !== newGuildScheduledEvent.description) { // If description changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The description of \`${oldGuildScheduledEvent.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old description",
              value: oldGuildScheduledEvent.description ? `\`${oldGuildScheduledEvent.description}\`` : "No description before"
            },
            {
              name: "New description",
              value: newGuildScheduledEvent.description ? `\`${newGuildScheduledEvent.description}\`` : "No new description"
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldGuildScheduledEvent.entityMetadata || newGuildScheduledEvent.entityMetadata) { // If there is an old or new location executes code
        if (!oldGuildScheduledEvent.entityMetadata && newGuildScheduledEvent.entityMetadata) { // If there is no old location but a new one it means a location was added
          oldGuildScheduledEventDeleteEmbed.setDescription(`> The location of \`${oldGuildScheduledEvent.name}\` has been added by \`${log.executor.tag}\``)
            .addField("New location", newGuildScheduledEvent.entityMetadata.location)

          await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name

        } else if (oldGuildScheduledEvent.entityMetadata && !newGuildScheduledEvent.entityMetadata) { // If there is an old location but no new one it means a location was removed
          oldGuildScheduledEventDeleteEmbed.setDescription(`> The location of \`${oldGuildScheduledEvent.name}\` has been removed by \`${log.executor.tag}\``)
            .addField("Old location", oldGuildScheduledEvent.entityMetadata.location)

          await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name

        } else if (oldGuildScheduledEvent.entityMetadata.location !== newGuildScheduledEvent.entityMetadata.location) { // Else if location just changed create embed
          oldGuildScheduledEventDeleteEmbed.setDescription(`> The location of \`${oldGuildScheduledEvent.name}\` has been updated by \`${log.executor.tag}\``)
            .addFields(
              {
                name: "Old location",
                value: oldGuildScheduledEvent.entityMetadata.location
              },
              {
                name: "New location",
                value: newGuildScheduledEvent.entityMetadata.location
              }
            )

          await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
        }
      }

      if (oldGuildScheduledEvent.entityType !== newGuildScheduledEvent.entityType) { // If the type changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The type of \`${oldGuildScheduledEvent.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old type",
              value: `\`${oldGuildScheduledEvent.entityType.toLowerCase().replaceAll("_", " ")}\``
            },
            {
              name: "New type",
              value: `\`${newGuildScheduledEvent.entityType.toLowerCase().replaceAll("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldGuildScheduledEvent.status !== newGuildScheduledEvent.status) { // If the status changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The status of \`${oldGuildScheduledEvent.name}\` has been updated`)
          .addFields(
            {
              name: "Old status",
              value: oldGuildScheduledEvent.status ? `\`${oldGuildScheduledEvent.status.toLowerCase()}\`` : "No status before"
            },
            {
              name: "New status",
              value: newGuildScheduledEvent.status ? `\`${newGuildScheduledEvent.status.toLowerCase()}\`` : "No new status"
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

    } else { // Else if nothing in the audit logs it means the change wasnt audit-logged

      if (oldGuildScheduledEvent.scheduledStartTimestamp !== newGuildScheduledEvent.scheduledStartTimestamp) { // If start changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The start of \`${oldGuildScheduledEvent.name}\` has been updated`)
          .addFields(
            {
              name: "Old start",
              value: `<t:${parseInt(oldGuildScheduledEvent.scheduledStartTimestamp / 1000)}:R>`
            },
            {
              name: "New start",
              value: `<t:${parseInt(newGuildScheduledEvent.scheduledStartTimestamp / 1000)}:R>`
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldGuildScheduledEvent.scheduledEndTimestamp !== newGuildScheduledEvent.scheduledEndTimestamp) { // If end changed create embed
        oldGuildScheduledEventDeleteEmbed.setDescription(`> The end of \`${oldGuildScheduledEvent.name}\` has been updated`)
          .addFields(
            {
              name: "Old end",
              value: `<t:${parseInt(oldGuildScheduledEvent.scheduledEndTimestamp / 1000)}:R>`
            },
            {
              name: "New end",
              value: `<t:${parseInt(newGuildScheduledEvent.scheduledEndTimestamp / 1000)}:R>`
            }
          )

        await createAndDeleteWebhook(oldGuildScheduledEventDeleteEmbed) // executes the function bellow with as parameter the embed name
      }
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(oldGuildScheduledEvent.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldGuildScheduledEvent.guild.iconURL({ format: "png" })
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
