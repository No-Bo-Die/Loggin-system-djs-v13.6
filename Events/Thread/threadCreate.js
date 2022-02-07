// Logs whenever a thread is created
// ❗ ms package needed `npm i ms` ❗

const { MessageEmbed, ThreadChannel, Client } = require("discord.js");
const ms = require("ms");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "threadCreate",
  /**
   * @param {ThreadChannel} thread
   */
  async execute(thread, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: thread.guild.id,
    });
    if (!Data) return;
    
    const logChannel = thread.guild.channels.cache.get(Data.LogsChannel);
    const logs = await thread.guild.fetchAuditLogs({
      limit: 1,
      type: "THREAD_CREATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const threadCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_createthread:866943416251973672> A Thread Has Been Created")
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(thread.guild.name)


    if (log) { // If entry of the type "GUILD_SCHEDULED_EVENT_DELETE" is existing executes code
      threadCreateEmbed.setDescription(`> A thread \`${thread.name}\` has been created by \`${log.executor.tag}\``)
        .addFields(
          {
            name: "Auto-archive",
            value: `\`${ms(thread.autoArchiveDuration * 60000)}\``
          },
          {
            name: "Invitable",
            value: thread.invitable ? "Yes" : "No"
          },
          {
            name: "Owner",
            value: `<@!${thread.ownerId}>`
          },
          {
            name: "Parent",
            value: thread.parentId ? `<#${thread.parentId}>` : "No parent"
          },
          {
            name: "Rate limit",
            value: thread.rateLimitPerUser ? `\`${ms(thread.rateLimitPerUser * 1000)}\`` : "No rate limit"
          },
          {
            name: "Type",
            value: `\`${thread.type.toLowerCase().replaceAll("_", " ")}\``
          }
        )

      await createAndDeleteWebhook(threadCreateEmbed) // executes the function bellow with as parameter the embed name
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(thread.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: thread.guild.iconURL({ format: "png" })
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
