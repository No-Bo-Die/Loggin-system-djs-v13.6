const { model, Schema } = require("mongoose");

module.exports = model(
  "LogsSetup",
  new Schema({
    GuildID: String,
    LogsChannel: String,
  })
);
