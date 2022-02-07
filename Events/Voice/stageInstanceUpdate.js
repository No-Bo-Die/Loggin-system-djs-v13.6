// Logs whenever a stage topic changed

const { MessageEmbed, StageInstance, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "stageInstanceUpdate",
  /**
   * @param {StageInstance} oldStageInstance
   * @param {StageInstance} newStageInstance
   */
  async execute(oldStageInstance, newStageInstance, client) {
      const Data = await LogsSetupData.findOne({
      GuildID: oldStageInstance.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldStageInstance.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await oldStageInstance.guild.fetchAuditLogs({
      limit: 1,
      type: "STAGE_INSTANCE_UPDATE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const oldStageInstanceCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_updatestage:866943415447191592> A Stage Instance Has Been Updated")
      .setColor("ORANGE")
      .setTimestamp()
      .setFooter(oldStageInstance.guild.name)


    if (log) { // If entry first entry is existing executes code
      if (oldStageInstance.topic !== newStageInstance.topic) { // If topic changed execute code
        oldStageInstanceCreateEmbed.setDescription(`> The topic of a stage has been changed in ${oldStageInstance.channel} by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old topic",
              value: `\`${oldStageInstance.topic}\``
            },
            {
              name: "New topic",
              value: `\`${newStageInstance.topic}\``
            }
          )

        await createAndDeleteWebhook(oldStageInstanceCreateEmbed) // executes the function bellow with as parameter the embed name
      }
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(oldStageInstance.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldStageInstance.guild.iconURL({ format: "png" })
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
