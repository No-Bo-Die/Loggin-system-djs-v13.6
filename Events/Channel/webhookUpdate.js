// Logs whenever a webhook name, avatar or channel is changed

const { Client, MessageEmbed, Channel } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "webhookUpdate",
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

    if (log.action == "WEBHOOK_UPDATE") { // If last entry is of type "WEBHOOK_UPDATE" executes code
      const webhookUpdate = new MessageEmbed()
        .setTitle("<:icons_updatewebhook:866943415384277002> A Webhook Has Been Updated")
        .setColor("ORANGE")
        .setTimestamp()
        .setFooter(channel.guild.name)

      if (log.changes.find(x => x.key == "avatar_hash")) { // If the changes line is called "avatar_hash" it means the avatar was changed

        webhookUpdate.setDescription(`> The avatar of the webhook \`${log.target.name}\` has been updated`)
          .setImage(`https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").new}.webp`)
          .addFields(
            {
              name: "Old avatar",
              value: log.changes.find(x => x.key == "avatar_hash").old ? `https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").old}.webp` : "No avatar before"
            },
            {
              name: "New avatar",
              value: log.changes.find(x => x.key == "avatar_hash").new ? `https://cdn.discordapp.com/avatars/${log.target.id}/${log.changes.find(x => x.key == "avatar_hash").new}.webp` : "No new avatar"
            }
          )

        await createAndDeleteWebhook(webhookUpdate) //executes the function bellow with as parameter the embed name
      }

      if (log.changes.find(x => x.key == "name")) { // If the changes line is called "name" it means the name was changed
        webhookUpdate.setDescription(`> The name of the webhook \`${log.changes.find(x => x.key == "name").new}\` has been updated`)
          .addFields(
            {
              name: "Old name",
              value: `\`${log.changes.find(x => x.key == "name").old}\``
            },
            {
              name: "New name",
              value: `\`${log.changes.find(x => x.key == "name").new}\``
            }
          )

        await createAndDeleteWebhook(webhookUpdate) //executes the function bellow with as parameter the embed name
      }

      if (log.changes.find(x => x.key == "channel_id")) { // If the changes line is called "channel_id" it means the channel was changed

        webhookUpdate.setDescription(`> The channel of the webhook \`${log.target.name}\` has been updated`)
          .addFields(
            {
              name: "Old channel",
              value: log.changes.find(x => x.key == "channel_id").old ? `<#${log.changes.find(x => x.key == "channel_id").old}>` : "No channel before"
            },
            {
              name: "New channel",
              value: log.changes.find(x => x.key == "channel_id").new ? `<#${log.changes.find(x => x.key == "channel_id").new}>` : "No new channel"
            }
          )

        await createAndDeleteWebhook(webhookUpdate) //executes the function bellow with as parameter the embed name
      }
    }

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
