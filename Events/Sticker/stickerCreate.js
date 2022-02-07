// Logs whenever a sticker is created

const { Client, MessageEmbed, Sticker } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "stickerCreate",
  /**
   * @param {Sticker} sticker
   */
  async execute(sticker, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: sticker.guild.id,
    });
    if (!Data) return;
    
    const logChannel = sticker.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await sticker.guild.fetchAuditLogs({
      limit: 1,
      type: "STICKER_CREATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "STICKER_CREATE"

    if (log) { // If there is a corresponding entry creates the embed
      const stickerCreateEmbed = new MessageEmbed()
        .setTitle("<:icons_createsticker:866943415370514442> A Sticker Has Been Created")
        .setColor("GREEN")
        .setDescription(`> The sticker \`${sticker.name}\` has been created by \`${log.executor.tag}\``)
        .addFields(
          {
            name: "Name",
            value: `\`${sticker.name}\``
          },
          {
            name: "Tags",
            value: sticker.tags.map(e => `\`${e}\``).join(" ")
          },
          {
            name: "Description",
            value: sticker.description ? `\`${sticker.description}\`` : "No description"
          }
        )
        .setImage(sticker.url)
        .setTimestamp()
        .setFooter(sticker.guild.name)

      await logChannel.createWebhook(sticker.guild.name, {// Creates a webhook in the logging channel specified before
        avatar: sticker.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [stickerCreateEmbed]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  },
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
