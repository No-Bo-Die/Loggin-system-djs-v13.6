// Logs whenever username changed, discriminator, flags, avatar, banner

const { MessageEmbed, Client, User, UserFlags } = require("discord.js");
const LogsSetupData = require("../../Structures/Schemas/LogsSetupDB");

module.exports = {
  name: "userUpdate",
  /**
   * @param {User} oldUser
   * @param {User} newUser
   * @param {Client} client
   */
  async execute(oldUser, newUser, client) {
    const guild = client.guilds.cache.get("ID") // Enter your guild ID 
    
    const Data = await LogsSetupData.findOne({
      GuildID: guild.id,
    });
    if (!Data) return;
    
    const logChannel = guild.channels.cache.get(Data.LogsChannel);

    const userUpdateEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle(`<:icons_updatemember:866943416256167936> A User Has Been Updated`)
      .setTimestamp()
      .setFooter(guild.name)

    if (oldUser.username !== newUser.username) { // If username changed execute code
      userUpdateEmbed.setDescription(`The user ${newUser} changed their username`)
        .addFields(
          {
            name: "Old username",
            value: `\`${oldUser.username}\``
          },
          {
            name: "New username",
            value: `\`${newUser.username}\``
          }
        )

      await createAndDeleteWebhook(userUpdateEmbed) //executes the function bellow with as parameter the embed name
    }

    if (oldUser.discriminator !== newUser.discriminator) { // If discriminator changed execute code
      userUpdateEmbed.setDescription(`The user ${newUser} changed their discriminator`)
        .addFields(
          {
            name: "Old discriminator",
            value: `\`${oldUser.discriminator}\``
          },
          {
            name: "New discriminator",
            value: `\`${newUser.discriminator}\``
          }
        )

      await createAndDeleteWebhook(userUpdateEmbed) //executes the function bellow with as parameter the embed name
    }

    if (!oldUser.flags.bitfield || !newUser.flags.bitfield) return
    if (oldUser.flags.bitfield != newUser.flags.bitfield) { // If flags changed execute code
      const newFlags = new UserFlags(newUser.flags.bitfield).toArray().slice(" ").map(e => `\`${e}\``).join(" ").toLowerCase().replaceAll("_", " ");
      userUpdateEmbed.setDescription(`The user ${newUser} changed their flags`)
        .addField("New flags", newFlags || "No flags anymore")

      await createAndDeleteWebhook(userUpdateEmbed) //executes the function bellow with as parameter the embed name
    }

    if (oldUser.avatar !== newUser.avatar) { // If avatar changed execute code
      userUpdateEmbed.setDescription(`The user ${newUser} changed their avatar`)
        .setImage(newUser.avatarURL({ dynamic: true }))
        .addFields(
          {
            name: "Old avatar",
            value: oldUser.avatar ? `${oldUser.avatarURL({ dynamic: true })}` : "No avatar before"
          },
          {
            name: "New avatar",
            value: newUser.avatar ? `${newUser.avatarURL({ dynamic: true })}` : "No new avatar"
          }
        )

      await createAndDeleteWebhook(userUpdateEmbed) //executes the function bellow with as parameter the embed name
    }

    if (oldUser.banner !== newUser.banner) { // If banner changed execute code
      userUpdateEmbed.setDescription(`The user ${newUser} changed their avatar`)
        .setImage(newUser.bannerURL({ dynamic: true }))
        .addFields(
          {
            name: "Old banner",
            value: oldUser.banner ? `${oldUser.bannerURL({ dynamic: true })}` : "No banner before"
          },
          {
            name: "New banner",
            value: newUser.banner ? `${newUser.bannerURL({ dynamic: true })}` : "No new banner"
          }
        )

      await createAndDeleteWebhook(userUpdateEmbed) //executes the function bellow with as parameter the embed name
    }


    async function createAndDeleteWebhook(embedName) {
      await logChannel.createWebhook(guild.name, { // Creates a webhook in the logging channel specified before
        avatar: guild.iconURL({ format: "png" })
      }).then(webhook => {
        webhook.send({ // Sends the embed and transcript file through the webhook
          embeds: [embedName]
        }).then(() => webhook.delete().catch(() => { })) // Deletes the webhook and catches the error if any
      });
    }
  }
}
