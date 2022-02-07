// Logs whenever a stage instance is deleted

const { MessageEmbed, StageInstance, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "stageInstanceDelete",
  /**
   * @param {StageInstance} stageInstance
   */
  async execute(stageInstance, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: stageInstance.guild.id,
    });
    if (!Data) return;
    
    const logChannel = stageInstance.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await stageInstance.guild.fetchAuditLogs({
      limit: 1,
      type: "STAGE_INSTANCE_DELETE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const stageInstanceCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_endstage:866943416377933824> A Stage Instance Has Been Deleted")
      .setColor("RED")
      .setTimestamp()
      .setFooter(stageInstance.guild.name)


    if (log) { // If entry first entry is existing executes code
      stageInstanceCreateEmbed.setDescription(`> A stage instance has been stopped in ${stageInstance.channel} by \`${log.executor.tag}\``)

      await createAndDeleteWebhook(stageInstanceCreateEmbed) // executes the function bellow with as parameter the embed name
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(stageInstance.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: stageInstance.guild.iconURL({ format: "png" })
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
