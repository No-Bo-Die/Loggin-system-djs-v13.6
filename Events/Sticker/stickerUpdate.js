// Logs whenever a sticker name, description or associated tags are updated

const { Client, MessageEmbed, Sticker } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "stickerUpdate",
  /**
   * @param {Sticker} oldSticker
   * @param {Sticker} newSticker
   */
  async execute(oldSticker, newSticker, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: oldSticker.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldSticker.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await oldSticker.guild.fetchAuditLogs({
      limit: 1,
      type: "STICKER_UPDATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "STICKER_UPDATE"

    if (log) { // If there is a corresponding entry creates the embed
      const stickerUpdateEmbed = new MessageEmbed()
        .setTitle("<:icons_updatesticker:866943415560175697> A Sticker Has Been Updated")
        .setColor("ORANGE")
        .setTimestamp()
        .setFooter(oldSticker.guild.name)

      if (oldSticker.name !== newSticker.name) { // If the name of the old and new stickers are different executes the code below
        stickerUpdateEmbed.setDescription(`> The name of the sticker \`${newSticker.name}\` has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old name",
              value: `\`${oldSticker.name}\``
            },
            {
              name: "New name",
              value: `\`${newSticker.name}\``
            }
          )

        await createAndDeleteWebhook(stickerUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldSticker.description !== newSticker.description) { // If the description of the old and new stickers are different executes the code below
        stickerUpdateEmbed.setDescription(`> The description of the sticker \`${oldSticker.name}\` has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old description",
              value: oldSticker.description ? `\`${oldSticker.description}\`` : "No description before"
            },
            {
              name: "New description",
              value: newSticker.description ? `\`${newSticker.description}\`` : "No new description"
            }
          )

        await createAndDeleteWebhook(stickerUpdateEmbed) // executes the function bellow with as parameter the embed name
      }

      if (oldSticker.tags !== newSticker.tags) { // If the tags (associated emoji) of the old and new stickers are different executes the code below
        stickerUpdateEmbed.setDescription(`> The tags of the sticker \`${oldSticker.name}\` has been changed by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old tags",
              value: oldSticker.tags.map(e => `\`${e}\` | :${e}:`).join("  ") // Maps through the tags and joins them with a double space
            },
            {
              name: "New tags",
              value: newSticker.tags.map(e => `\`${e}\` | :${e}:`).join("  ") // Same as above
            }
          )

        await createAndDeleteWebhook(stickerUpdateEmbed) // executes the function bellow with as parameter the embed name
      }
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(oldSticker.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldSticker.guild.iconURL({ format: "png" })
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
