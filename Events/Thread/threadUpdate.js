// Logs whenever a thread name, archived, auto-archive duration, invitable, locked, cooldown is changed
// ❗ ms package needed `npm i ms` ❗

const { MessageEmbed, ThreadChannel, Client } = require("discord.js");
const ms = require("ms");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "threadUpdate",
  /**
   * @param {ThreadChannel} oldThread
   * @param {ThreadChannel} newThread
   */
  async execute(oldThread, newThread, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: oldThread.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldThread.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await oldThread.guild.fetchAuditLogs({
      limit: 1,
      type: "THREAD_UPDATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "THREAD_UPDATE"

    const oldThreadUpdateEmbed = new MessageEmbed()
      .setTitle("<:icons_updatethread:866943415136026674> A Thread Has Been Updated")
      .setColor("ORANGE")
      .setTimestamp()
      .setFooter(oldThread.guild.name)


    if (log) { // If entry is existing executes code
      if (oldThread.name !== newThread.name) {
        oldThreadUpdateEmbed.setDescription(`> The name of ${newThread} has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old name",
              value: `\`${oldThread.name}\``
            },
            {
              name: "New name",
              value: `\`${newThread.name}\``
            }
          )

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (!oldThread.archived && newThread.archived) {
        oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is now archived`)

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      } else if (oldThread.archived && !newThread.archived) {
        oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is not archived anymore`)

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
        oldThreadUpdateEmbed.setDescription(`> The auto-archive of ${newThread} has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old auto-archive",
              value: `\`${ms(oldThread.autoArchiveDuration * 60000)}\``
            },
            {
              name: "New auto-archive",
              value: `\`${ms(newThread.autoArchiveDuration * 60000)}\``
            }
          )

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldThread.type !== "GUILD_PUBLIC_THREAD") {
        if (!oldThread.invitable && newThread.invitable) {
          oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is now invitable`)

          await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
        } else if (oldThread.invitable && !newThread.invitable) {
          oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is not invitable anymore`)

          await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
        }
      }

      if (!oldThread.locked && newThread.locked) {
        oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is now locked`)

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      } else if (oldThread.locked && !newThread.locked) {
        oldThreadUpdateEmbed.setDescription(`> The thread ${oldThread} is not locked anymore`)

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
        oldThreadUpdateEmbed.setDescription(`> The cooldown of ${newThread} has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old cooldown",
              value: oldThread.rateLimitPerUser ? `\`${ms(oldThread.rateLimitPerUser * 1000)}\`` : "No cooldown before"
            },
            {
              name: "New cooldown",
              value: newThread.rateLimitPerUser ? `\`${ms(newThread.rateLimitPerUser * 1000)}\`` : "No new cooldown"
            }
          )

        await createAndDeleteWebhook(oldThreadUpdateEmbed) // executes the function bellow with as parameter the embed name
      }
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(oldThread.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldThread.guild.iconURL({ format: "png" })
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
