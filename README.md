# Loggin-system-djs-v13.6
***Full logging system using the djs library (v13.6.0)***

***NOW ONTO MULTIPLE DISCLAIMERS:***

◻ `It is crucial that you first understand two details about audit logs: first they are not guaranteed to arrive when you expect them (if at all), second there is no event which triggers when an audit log is created.`

◻ `I just realised i did all my footer the deprecated way i aint updating 30 sourcebins rn, in `#common-errors`u can see the good way of doing them`

◻ `All of this events are made for a single guild, up to you to make them multi-guild using a DB.`

◻ `In every sourcebin it says what the file below logs (the actions that it logs) and u can also see a lot of commented text in each event to show exactly how the code works, feel free to remove them as they take a lot of visual space.`

◻ `The userUpdate is not multi guild at all (as the name suggests) a user is someone out of the guild, in the current way it is, if a user is in one of the bot server's it will send the log in every server or just bug out, to resolve that u would have to use forEach loop between every server the bot is in and send the log message only in those the user is in too.`

◻ `This is just a template i share to yall, so no need to tell me "i dont like that" or "this would look better this way" idc, it is up to you for customization i just provide the system. I think you all know how to make an embed thats not too hard.`

◻ `The way i log is creating a webhook sending what i need in it and deleting it right after (you can see it by the function at the end of each file) feel free to remove the function and log however u want. If u plan using it tho u might wanna know that if the bot bugs out or anything and webhooks are starting to get created but never  are deleted (it happened to me because of an API issue, like it didnt log anything then 20 minutes later logged everything at once) u will have the error i shared below, just meaning u reached the 10 webhooks limit per channel so delete some/all of them.`

https://srcb.in/PpdQQZrrwW

◻ `If u know what u are doing and still u dont like the way the *system* works u can improve it or just change it yourself (i link right below the class affiliated to audit logs in the docs and the Client class to see all available events), u can also log the entry of the audit logs in each event to see what the entry returns and therefore what u can use.`

https://discord.js.org/#/docs/discord.js/stable/class/GuildAuditLogs

https://discord.js.org/#/docs/discord.js/stable/class/Client

(This is the work of 4 days  on and off so please leave the credits at the end of each files if u plan on using them, you can create a thread on this message for any report of an error or propose things in the ***system*** that could be improved, but please dont ask me how to do something or complain that u dont like the way an embed looks)

Btw im sorry i know this is a lot of things to read, i never even thought myself i would ever go over the 4k characters limit per message with actual ***useful*** stuff and not some copy paste to test the limit :man_shrugging: 

Feel free to react with :noice_yes: if you approve this and read it all lol
