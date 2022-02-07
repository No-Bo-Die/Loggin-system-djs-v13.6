// Logs whenever a message is updated

const { MessageEmbed, WebhookClient, Message } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "messageUpdate",
  /**
   * @param {Message} oldMessage 
   * @param {Message} newMessage 
   */
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return; // If content of old and new messages are the same it returns
    
    const Data = await LogsSetupData.findOne({
      GuildID: oldMessage.guild.id,
    });
    if (!Data) return;

    const logChannel = oldMessage.guild.channels.cache.get(Data.LogsChannel); 
    const Original = oldMessage.content.slice(0, 1000) + (oldMessage.content.length > 1000 ? " ..." : ""); // As the updated message is sent in a field which the limit of is 1024 character if the size of the message is more than 1k characters it adds ... at th end
    const Edited = newMessage.content.slice(0, 1000) + (newMessage.content.length > 1000 ? " ..." : ""); // Same as line before

    const messageEditedEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("<:icons_updatechannel:866943415450599437> A Message Has Been Updated")
      .setDescription(`> A message by ${oldMessage.member} has been updated`)
      .setTimestamp()
      .setFooter(oldMessage.guild.name)
      .addFields(
        {
          name: "Old message",
          value: Original
        },
        {
          name: "New message",
          value: Edited
        }
      )

    await logChannel.createWebhook(oldMessage.guild.name, { // Creates a webhook in the logging channel specified before
      avatar: oldMessage.guild.iconURL({ format: "png" })
    }).then(webhook => {
      webhook.send({ // Sends the embed through the webhook
        embeds: [messageEditedEmbed]
      }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
    });
  }
}
