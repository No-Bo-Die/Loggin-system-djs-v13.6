// Logs whenever a sticker is deleted

const { Client, MessageEmbed, Sticker } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "stickerDelete",
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
      type: "STICKER_DELETE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "STICKER_DELETE"

    if (log) { // If there is a corresponding entry creates the embed
      const stickerDeleteEmbed = new MessageEmbed()
        .setTitle("<:icons_deletesticker:866943415912497163> A Sticker Has Been Deleted")
        .setColor("RED")
        .setDescription(`> The sticker \`${sticker.name}\` has been deleted by \`${log.executor.tag}\``)
        .setTimestamp()
        .setFooter(sticker.guild.name)

      await logChannel.createWebhook(sticker.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: sticker.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [stickerDeleteEmbed]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  },
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
