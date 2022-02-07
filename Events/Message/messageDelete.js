// Logs whenever a message is deleted

const { MessageEmbed, Message, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    if (message.author.bot) return;
    const Data = await LogsSetupData.findOne({
      GuildID: message.guild.id,
    });
    if (!Data) return;
    
    const logChannel = message.guild.channels.cache.get(Data.LogsChannel);
    const logs = await message.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first(); // Fetches the audit logs and takes the last entry

    const messageContent = message.content.slice(0, 1000) + (message.content.length > 1000 ? " ..." : ""); // As the deleted message is sent in a field which the limit of is 1024 character if the size of the message is more than 1k characters it adds ... at th end

    const messageDeletedEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("<:icons_deletethread:866943415988256798> A Message Has Been Deleted")
      .setTimestamp()
      .setFooter(message.guild.name)
      .addField("Deleted message:", messageContent)

    if (message.attachments.size >= 1) { // If the message got attachments it maps them by their url
      messageDeletedEmbed.addField(`Attachments:`, `${message.attachments.map(a => `[image](${a.url})`).join("\n")}`)
    }

    if (log.action == "MESSAGE_DELETE") { // If the last entry fetched is of the type "MESSAGE_DELETE" executes code
      messageDeletedEmbed.setDescription(`> A message by ${message.member} in <#${message.channelId}> was deleted by \`${log.executor.tag}\``)

      await createAndDeleteWebhook(messageDeletedEmbed); // executes the function bellow with as parameter the embed name
    } else { // Else it means they deleted it themselves
      messageDeletedEmbed.setDescription(`> A message by ${message.member} in <#${message.channelId}> was deleted by themselves`)

      await createAndDeleteWebhook(messageDeletedEmbed); // executes the function bellow with as parameter the embed name
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(message.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: message.guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  }
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
