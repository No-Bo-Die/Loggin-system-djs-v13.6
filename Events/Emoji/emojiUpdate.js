// Logs whenever an emoji is deletedupdate, only the name can be changed, uses audit logs and client basic event

const { Client, MessageEmbed, Emoji } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "emojiUpdate",
  /**
   * @param {Emoji} oldEmoji
   * @param {Emoji} newEmoji
   */
  async execute(oldEmoji, newEmoji, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: oldEmoji.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldEmoji.guild.channels.cache.get(Data.LogsChannel); // Enter your log channel ID
    const logs = await oldEmoji.guild.fetchAuditLogs({
      limit: 1,
      type: "EMOJI_UPDATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "EMOJI_UPDATE"

    if (log) { // If there is a corresponding entry creates the embed
      const emojiUpdateEmbed = new MessageEmbed()
        .setTitle("<:icons_updateemoji:866943416343461891> An Emoji Has Been Updated")
        .setColor("ORANGE")
        .setDescription(`> The emoji's name of \`${newEmoji.name}\` has been updated by \`${log.executor.tag}\``)
        .addFields(
          {
            name: "Old name",
            value: `\`${oldEmoji.name}\``
          },
          {
            name: "New name",
            value: `\`${newEmoji.name}\``
          }
        )

      await logChannel.createWebhook(oldEmoji.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldEmoji.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [emojiUpdateEmbed]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  },
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
