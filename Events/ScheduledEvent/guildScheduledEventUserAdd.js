// Logs whenever a user subscribes to an event
// ❗ new `GUILD_SCHEDULED_EVENTS` intent needed to work ❗

const { MessageEmbed, GuildScheduledEvent, User, Client } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");


module.exports = {
  name: "guildScheduledEventUserAdd",
  /**
   * @param {GuildScheduledEvent} guildScheduledEvent
   * @param {User} user
   */
  async execute(guildScheduledEvent, user, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: guildScheduledEvent.guild.id,
    });
    if (!Data) return;
    
    const logChannel = guildScheduledEvent.guild.channels.cache.get(Data.LogsChannel); 

    const guildScheduledEventUserAdd = new MessageEmbed()
      .setTitle("<:icons_scheduleevent:866943416021811200> A User Subscribed To An Event")
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(guildScheduledEvent.guild.name)
      .setDescription(`> The user \`${user.tag}\` subscribed to the event ${guildScheduledEvent.name}`)

    await createAndDeleteWebhook(guildScheduledEventUserAdd) // executes the function bellow with as parameter the embed name


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(guildScheduledEvent.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: guildScheduledEvent.guild.iconURL({ format: "png" })
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
