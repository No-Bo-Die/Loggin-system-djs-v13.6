// Logs whenever is servermuted/demuted, serverdeafened/undeafened, starts/stops streaming,
// join a vc, leaves a vc/is disconnected from a vc, switches vc/is moved of vc

const { MessageEmbed, WebhookClient, Client, VoiceState, NewsChannel } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {Client} client
   */
  async execute(oldState, newState, client) {
    if (oldState.channel === null && newState.channel === null) return; // Returns if the oldState and newState are the same a.k.a didnt change
    
    const Data = await LogsSetupData.findOne({
      GuildID: oldState.guild.id,
    });
    if (!Data) return;
    
    const logChannel = oldState.guild.channels.cache.get(Data.LogsChannel);
    const logs = await oldState.guild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first(); // Fetches the audit logs and takes the last entry

    const memberVoiceStatusChangeEmbed = new MessageEmbed()
      .setTitle("<:icons_updatemember:866943416256167936> The voice status of a member changed")
      .setTimestamp()
      .setFooter(oldState.guild.name)

    // All the mute and deaf changes log its server wise, selfmute/selfdeaf would spam the API
    if (!oldState.serverMute && newState.serverMute) { // If the oldState member isnt mute and the newState one is, it means the member has been muted
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} is now muted on the server (voice channels)`).setColor("RED");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);

    } else if (oldState.serverMute && !newState.serverMute) { // If the oldState member is mute and the newState one isnt, it means the member has been unmuted
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} is now unmuted on the server (voice channels)`).setColor("GREEN");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);
    }

    if (!oldState.serverDeaf && newState.serverDeaf) { // If the oldState member isnt deaf and the newState one is, it means the member has been deafened
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} is now deafened on the server (voice channels)`).setColor("RED");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);

    } else if (oldState.serverDeaf && !newState.serverDeaf) { // If the oldState member is deaf and the newState one isnt, it means the member has been undeafened
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} is now undeafened on the server (voice channels)`).setColor("GREEN");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);
    }

    if (!oldState.streaming && newState.streaming) { // If the oldState member isnt streaming and the newState one is, it means the member has started to stream
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} has started streaming in \`${newState.channel.name}\``).setColor("GREEN");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);

    } else if (oldState.streaming && !newState.streaming) { // If the oldState member is streaming and the newState one isnt, it means the member has stopped streaming
      memberVoiceStatusChangeEmbed.setDescription(`> ${oldState.member} has stopped streaming in \`${newState.channel.name}\``).setColor("RED");
      await createAndDeleteWebhook(memberVoiceStatusChangeEmbed);
    }

    if (!oldState.channelId && newState.channelId && !oldState.channel && newState.channel) { // If the oldState member's channel and channelID arent defined and the newState member's ones are, it means the member has joined a vc
      const memberJoinChannelEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`<:icons_updatemember:866943416256167936> A Member Has Joined A Channel`)
        .setTimestamp()
        .setFooter(oldState.guild.name)
        .setDescription(`> The member ${oldState.member} has joined a channel`)
        .addField("Channel joined", `\`${newState.channel.name}\``)

      await createAndDeleteWebhook(memberJoinChannelEmbed); // executes the function bellow with as parameter the embed name
    }

    if (oldState.channelId && !newState.channelId && oldState.channel && !newState.channel) { // If the oldState member's channel and channelID are defined and the newState member's ones arent, it means the member has left a vc
      if (log.action == "MEMBER_DISCONNECT") { // If the last entry fetched is of the type "MEMBER_DISCONNECT" it means the member has been disconnected by someone so it executes the code
        const memberDisconnectedEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle(`<:icons_banmembers:866943415361732628> A Member Has Been Disconnected`)
          .setTimestamp()
          .setFooter(oldState.guild.name)
          .setDescription(`> The member ${oldState.member} has been disconnected by \`${log.executor.tag}\``)
          .addField("Channel left", `\`${oldState.channel.name}\``)

        await createAndDeleteWebhook(memberDisconnectedEmbed); // executes the function bellow with as parameter the embed name
      } else { // Else it means they left by themselves

        const memberLeftChannelEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle(`<:icons_banmembers:866943415361732628> A Member Has Left A Channel`)
          .setTimestamp()
          .setFooter(oldState.guild.name)
          .setDescription(`> The member ${oldState.member} has left a channel`)
          .addField("Channel left", `\`${oldState.channel.name}\``)

        await createAndDeleteWebhook(memberLeftChannelEmbed); // executes the function bellow with as parameter the embed name
      }
    }

    if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) { // If the oldState member's channel and channelID are defined and the newState member's ones are too, it means the member still is in a vc
      if (oldState.channelId !== newState.channelId) { // Checks oldState member's channel and the newState's one are different, if they arent it means the member didnt change vc
        if (log.action == "MEMBER_MOVE") { // If the last entry fetched is of the type "MEMBER_MOVE" it means the member has been moved by someone so it executes the code
          const memberMoveEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`<:icons_updatemember:866943416256167936> A Member Has Been Moved`)
            .setTimestamp()
            .setFooter(oldState.guild.name)
            .setDescription(`> The member ${oldState.member} has been moved by \`${log.executor.tag}\``)
            .addFields(
              {
                name: "Old channel",
                value: `\`${oldState.channel.name}\``
              },
              {
                name: "New channel",
                value: `\`${newState.channel.name}\``
              }
            )

          await createAndDeleteWebhook(memberMoveEmbed); // executes the function bellow with as parameter the embed name
        } else { // Else it means they switched channels by themselves
          const MemberLeftChannelEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("<:icons_updatemember:866943416256167936> A member moved from a channel to another")
            .setTimestamp()
            .setFooter(oldState.guild.name)
            .setDescription(`> The member ${oldState.member} has changed channels`)
            .addFields(
              {
                name: "Old channel",
                value: `\`${oldState.channel.name}\``
              },
              {
                name: "New channel",
                value: `\`${newState.channel.name}\``
              }
            )

          await createAndDeleteWebhook(MemberLeftChannelEmbed); // executes the function bellow with as parameter the embed name
        }
      }
    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(oldState.guild.name, { // Creates a webhook in the logging channel specified before
        avatar: oldState.guild.iconURL({ format: "png" })
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
