// Logs whenever multiple were deleted at once (save the messages in a transcript)
// ❗ transcript package needed `npm i discord-html-transcripts` ❗

const { MessageEmbed, Message, WebhookClient, Client } = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "messageDeleteBulk",
  /**
   * @param {Message} messages
   * @param {Client} client
   */
  async execute(messages, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: messages.first().guild.id,
    });
    if (!Data) return;
    
    const logChannel = messages.first().guild.channels.cache.get(Data.LogsChannel); 
    const logs = await messages.first().guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first(); // Fetches the audit logs and takes the last entry

    const tooMuch = messages.size;
    const message = await messages.map((m) => m); // Maps the messages that were deleted
    const channel = messages.first().channel;
    const ID = Math.floor(Math.random() * 5485444) + 4000000;

    try { // The try/catch is because sometimes the transcript isnt created for more info ask me on discord
      const attachment = await discordTranscripts.generateFromMessages(message, channel, { // Creates the transcript
        returnBuffer: false,
        fileName: `transcript-${ID}.html`
      });

      const Log = new MessageEmbed()
        .setColor("RED")
        .setTitle(`<:icons_deletechannel:866943415396990987> Multiple Messages Were Deleted`)
        .setTimestamp()
        .setFooter(messages.first().guild.name);

      if (log.action == "MESSAGE_BULK_DELETE") { // If the last entry fetched is of the type "MESSAGE_BULK_DELETE" executes code
        Log.setDescription(`> \`${tooMuch}\` messages were delete in <#${messages.first().channelId}> by \`${log.executor.tag}\``)
      } else { // Else if nothing was found executes code
        Log.setDescription(`> \`${tooMuch}\` messages were delete in <#${messages.first().channelId}>`)
      }

      await logChannel.createWebhook(messages.first().guild.name, { // Creates a webhook in the logging channel specified before
        avatar: messages.first().guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed and transcript file through the webhook
          embeds: [Log],
          files: [attachment]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    } catch (e) {
      console.log(e)
    }
  }
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
