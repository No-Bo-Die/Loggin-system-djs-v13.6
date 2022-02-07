// Logs whenever following things are changed: name, afk channel, afk timeout, banner, message notif setting, description, discovery splash image,
// content filter, guild icon, mfa level, nsfw level, owner, preferred language, boost progress bar (enabled/disabled), public update channel, rules channel,
// system channel, flags for system channel, vanity url, verification level, verified/unverified guild, widget enabled/disabled, widget channel, partnered/unpartnered,
// boost added/removed, tier
// ❗ ms package needed `npm i ms` ❗

const { Client, MessageEmbed, Guild, SystemChannelFlags } = require("discord.js");
const ms = require("ms");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "guildUpdate",
  /**
   * @param {Guild} oldGuild
   * @param {Guild} newGuild
   */
  async execute(oldGuild, newGuild, client) {
    const Data = await LogsSetupData.findOne({
      GuildID: oldGuild.id,
    });
    if (!Data) return;
    
    const logChannel = oldGuild.channels.cache.get(Data.LogsChannel);
    const logs = await oldGuild.fetchAuditLogs({
      limit: 1,
    })
    const log = logs.entries.first(); // Fetches the logs and takes the last entry 

    const guildUpdateLogEmbed = new MessageEmbed()
      .setTitle("<:icons_updateserver:866943416158781451> The guild Has Been Updated")
      .setColor("ORANGE")
      .setTimestamp()
      .setFooter(oldGuild.name)

    if (log.action == "GUILD_UPDATE") { // If the last entry fetched is of the type "GUILD_UPDATE" executes code below
      if (oldGuild.name !== newGuild.name) { // If guild name has changed create embed
        guildUpdateLogEmbed.setDescription(`> The name of \`${newGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old name",
              value: `\`${oldGuild.name}\``
            },
            {
              name: "New name",
              value: `\`${newGuild.name}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }
      if (oldGuild.afkChannelId !== newGuild.afkChannelId) { // If afk channel changed create embed
        guildUpdateLogEmbed.setDescription(`> The AFK channel of \`${newGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old AFK channel",
              value: oldGuild.afkChannelId ? `\`${oldGuild.afkChannel.name}\`` : "No AFK channel before"
            },
            {
              name: "New AFK channel",
              value: newGuild.afkChannelId ? `\`${newGuild.afkChannel.name}\`` : "No new AFK channel"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }
      if (oldGuild.afkTimeout !== newGuild.afkTimeout) { // If the afk timeout changed create embed
        guildUpdateLogEmbed.setDescription(`> The AFK timeout of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old AFK timeout",
              value: `\`${ms(oldGuild.afkTimeout * 1000)}\``
            },
            {
              name: "New AFK timeout",
              value: `\`${ms(newGuild.afkTimeout * 1000)}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.banner !== newGuild.banner) { // If banner changed create embed
        guildUpdateLogEmbed.setDescription(`> The banner of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .setImage(newGuild.bannerURL({ dynamic: true }))
          .addFields(
            {
              name: "Old banner",
              value: oldGuild.banner ? `${oldGuild.bannerURL({ dynamic: true })}` : "No banner before"
            },
            {
              name: "New banner",
              value: newGuild.banner ? `${newGuild.bannerURL({ dynamic: true })}` : "No new banner"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) { // If message notif setting changed create embed
        guildUpdateLogEmbed.setDescription(`> The default message notification of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old default message notification",
              value: `\`${oldGuild.defaultMessageNotifications.toLowerCase().replace("_", " ")}\``
            },
            {
              name: "New default message notification",
              value: `\`${newGuild.defaultMessageNotifications.toLowerCase().replace("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.description !== newGuild.description) { // If description changed create embed
        guildUpdateLogEmbed.setDescription(`> The description of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old description",
              value: oldGuild.description ? `\`${oldGuild.description}\`` : "No description before"
            },
            {
              name: "New description",
              value: newGuild.description ? `\`${newGuild.description}\`` : "No new description"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.discoverySplash !== newGuild.discoverySplash) { // If discovery splash image changed create embed
        guildUpdateLogEmbed.setDescription(`> The disovery splash image of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .setImage(newGuild.disoverySplashURL())
          .addFields(
            {
              name: "Old disovery splash image",
              value: oldGuild.disoverySplash ? `${oldGuild.disoverySplashURL()}` : "No disovery splash image before"
            },
            {
              name: "New disovery splash image",
              value: newGuild.disoverySplash ? `${newGuild.disoverySplashURL()}` : "No new disovery splash image"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) { // If content filter changed create embed
        guildUpdateLogEmbed.setDescription(`> The explicit content filter of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old explicit content filter",
              value: `\`${oldGuild.explicitContentFilter.toLowerCase().replaceAll("_", " ")}\``
            },
            {
              name: "New explicit content filter",
              value: `\`${newGuild.explicitContentFilter.toLowerCase().replaceAll("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.icon !== newGuild.icon) { // If guild icon changed create embed
        guildUpdateLogEmbed.setDescription(`> The icon of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .setImage(newGuild.iconURL({ dynamic: true }))
          .addFields(
            {
              name: "Old icon",
              value: oldGuild.icon ? `${oldGuild.iconURL({ dynamic: true })}` : "No icon before"
            },
            {
              name: "New icon",
              value: newGuild.icon ? `${newGuild.iconURL({ dynamic: true })}` : "No new icon"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.mfaLevel !== newGuild.mfaLevel) { // If mfa level changed create embed
        guildUpdateLogEmbed.setDescription(`> The MFA level of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old MFA level",
              value: `\`${oldGuild.mfaLevel.toLowerCase().replaceAll("_", " ")}\``
            },
            {
              name: "New MFA level",
              value: `\`${newGuild.mfaLevel.toLowerCase().replaceAll("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) { // If nsfw level changed create embed
        guildUpdateLogEmbed.setDescription(`> The NSFW level of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old NSFW level",
              value: `\`${oldGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\``
            },
            {
              name: "New NSFW level",
              value: `\`${newGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.ownerId !== newGuild.ownerId) { // If the owner changed create embed
        guildUpdateLogEmbed.setDescription(`> The owner of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old owner",
              value: `<@!${oldGuild.ownerId}>`
            },
            {
              name: "New owner",
              value: `<@!${newGuild.ownerId}>`
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.preferredLocale !== newGuild.preferredLocale) { // If the preferred language changed create embed
        guildUpdateLogEmbed.setDescription(`> The preferred locale of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old preferred locale",
              value: oldGuild.preferredLocale ? `\`${oldGuild.preferredLocale.toLowerCase()}\`` : "No preferred locale before"
            },
            {
              name: "New preferred locale",
              value: newGuild.preferredLocale ? `\`${newGuild.preferredLocale.toLowerCase()}\`` : "No new preferred locale"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (!oldGuild.premiumProgressBarEnabled && newGuild.premiumProgressBarEnabled) { // The boost progress bar not existing before and existing after the change means it was activated 
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now has its nitro progress bar enabled`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      } else if (oldGuild.premiumProgressBarEnabled && !newGuild.premiumProgressBarEnabled) { // The boost progress bar existing before and not existing after the change means it was deactivated 
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now hasnt its nitro progress bar enabled anymore`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) { // If public changed channel changed create embed
        guildUpdateLogEmbed.setDescription(`> The public updates channel of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old public updates channel",
              value: oldGuild.publicUpdatesChannelId ? `\`${oldGuild.publicUpdatesChannel.name}\`` : "No public updates channel before"
            },
            {
              name: "New public updates channel",
              value: newGuild.publicUpdatesChannelId ? `\`${newGuild.publicUpdatesChannel.name}\`` : "No new public updates channel"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) { // If rules channel changed create embed
        guildUpdateLogEmbed.setDescription(`> The rules channel of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old rules channel",
              value: oldGuild.rulesChannelId ? `\`${oldGuild.rulesChannel.name}\`` : "No rules channel before"
            },
            {
              name: "New rules channel",
              value: newGuild.rulesChannelId ? `\`${newGuild.rulesChannel.name}\`` : "No new rules channel"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.systemChannelId !== newGuild.systemChannelId) { // If system channel changed create embed
        guildUpdateLogEmbed.setDescription(`> The system channel of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old system channel",
              value: oldGuild.systemChannelId ? `\`${oldGuild.systemChannel.name}\`` : "No system channel before"
            },
            {
              name: "New system channel",
              value: newGuild.systemChannelId ? `\`${newGuild.systemChannel.name}\`` : "No new system channel"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.systemChannelFlags.bitfield !== newGuild.systemChannelFlags.bitfield) { // If the flags for system channel were changed create embed
        const pp = new SystemChannelFlags(newGuild.systemChannelFlags.bitfield).toArray().slice(" ").map(e => `\`${e}\``).join(" ").toLowerCase().replaceAll("_", " ");
        guildUpdateLogEmbed.setDescription(`> The system flags of \`${oldGuild.name}\` have been updated by \`${log.executor.tag}\``)
          .addField("Deactivated", pp || "All are now activated")

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) { // If vanity URL was changed create embed
        guildUpdateLogEmbed.setDescription(`> The vanity URL of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old vanity URL",
              value: oldGuild.vanityURLCode ? `\`${oldGuild.vanityURLCode}\`` : "No vanity URL before"
            },
            {
              name: "New vanity URL",
              value: newGuild.vanityURLCode ? `\`${newGuild.vanityURLCode}\`` : "No new vanity URL"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.verificationLevel !== newGuild.verificationLevel) { // If verification level was changed create embed
        guildUpdateLogEmbed.setDescription(`> The verification level of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old verification level",
              value: `\`${oldGuild.verificationLevel.toLowerCase().replace("_", " ")}\``
            },
            {
              name: "New verification level",
              value: `\`${newGuild.verificationLevel.toLowerCase().replace("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (!oldGuild.verified && newGuild.verified) { // The guild not being verified before and verified after the change means it was verified
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now is verified`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      } else if (oldGuild.verified && !newGuild.verified) { // The guild being verified before and not verified after the change means it was revoked verified
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now isnt verified anymore`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (!oldGuild.widgetEnabled && newGuild.widgetEnabled) { // The widget not being enabled before and enabled after the change means it was enabled
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now has widget enabled`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      } else if (oldGuild.widgetEnabled && !newGuild.widgetEnabled) { // The widget being enabled before and not enabled after the change means it was disabled
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` now hasnt widget enabled anymore`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.widgetChannelId !== newGuild.widgetChannelId) { // If widget channel changed create embed
        guildUpdateLogEmbed.setDescription(`> The widget channel of \`${oldGuild.name}\` has been updated by \`${log.executor.tag}\``)
          .addFields(
            {
              name: "Old widget channel",
              value: oldGuild.widgetChannelId ? `\`${oldGuild.widgetChannel.name}\`` : "No widget channel before"
            },
            {
              name: "New wiget channel",
              value: newGuild.widgetChannelId ? `\`${newGuild.widgetChannel.name}\`` : "No new widget channel"
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }
    } else { // Else if the last entry isnt of the type "GUILD_UPDATE" it means the action was not audit-logged

      if (!oldGuild.partnered && newGuild.partnered) { // The guild not being partnered before and partnered after the change means it was partnered
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` is now partnered with Discord`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      } else if (oldGuild.partnered && !newGuild.partnered) { // The guild being partnered before and not partnered after the change means it was revoked partnered
        guildUpdateLogEmbed.setDescription(`The guild \`${oldGuild.name}\` is not partnered with Discord anymore`)

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) { // If boost number changed execute code
        if (oldGuild.premiumSubscriptionCount < newGuild.premiumSubscriptionCount) { // If the new boost count is higher after it means someone started boosting
          guildUpdateLogEmbed.setDescription(`Someone started boosting \`${oldGuild.name}\``)
        } else if (oldGuild.premiumSubscriptionCount > newGuild.premiumSubscriptionCount) { // If the old boost count is higher it means someone stopped boosted
          guildUpdateLogEmbed.setDescription(`Someone stopped boosting \`${oldGuild.name}\``)
        }
        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

      if (oldGuild.premiumTier !== newGuild.premiumTier) { // If premium tier changed create embed
        guildUpdateLogEmbed.setDescription(`> The premium tier of \`${oldGuild.name}\` has been updated`)
          .addFields(
            {
              name: "Old premium tier",
              value: `\`${oldGuild.premiumTier.toLowerCase().replaceAll("_", " ")}\``
            },
            {
              name: "New premium tier",
              value: `\`${newGuild.nsfwLevel.toLowerCase().replaceAll("_", " ")}\``
            }
          )

        await createAndDeleteWebhook(guildUpdateLogEmbed) //executes the function bellow with as parameter the embed name
      }

    }

    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(newGuild.name, { // Creates a webhook in the logging channel specified before
        avatar: newGuild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  },
};


// Code created by 刀ტ乃ტのၦ#0001 on discord
// Licence: MIT
