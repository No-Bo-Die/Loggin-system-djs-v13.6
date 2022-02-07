// Logs whenever a role is deleted

const { MessageEmbed, Role, Permissions, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "roleDelete",
  /**
   * @param {Role} role
   */
  async execute(role, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: role.guild.id,
    });
    if (!Data) return;
    
    const logChannel = role.guild.channels.cache.get(Data.LogsChannel); 
    const logs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_DELETE"
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry

    const roleCreateEmbed = new MessageEmbed()
      .setTitle("<:icons_deleterole:866943415895851018> A Role Has Been Deleted")
      .setColor("RED")
      .setTimestamp()
      .setFooter(role.guild.name)


    if (log) { // If entry first entry is existing executes code
      roleCreateEmbed.setDescription(`> The role \`${role.name}\` has been deleted by \`${log.executor.tag}\``)

      await createAndDeleteWebhook(roleCreateEmbed) // executes the function bellow with as parameter the embed name
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(role.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: role.guild.iconURL({ format: "png" })
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
