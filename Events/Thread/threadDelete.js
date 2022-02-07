// Logs whenever a thread is deleted

const { MessageEmbed, ThreadChannel, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "threadDelete",
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
      type: "THREAD_DELETE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry of the type "THREAD_DELETE"

    const threadCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_deletethread:866943415988256798> A Thread Has Been Deleted")
      .setColor("RED")
      .setTimestamp()
      .setFooter(thread.guild.name)


    if (log) { // If entry is existing executes code
      threadCreateEmbed.setDescription(`> A thread \`${thread.name}\` has been deleted by \`${log.executor.tag}\``)
        .addField("Parent", thread.parentId ? `<#${thread.parentId}>` : "No parent")

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
