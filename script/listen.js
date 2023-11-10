const cmd = require("./commands/commands.js");

const listen = async ({ api, event }) => {
  try {
    const { threadID, senderID, type, userID, from, isGroup } = event;
    /*
    if (["message", "message_reply", "message_reaction", "typ"].includes(type)) {
      if (isGroup) {

      }

    }*/

    switch (type) {
      case "message":
        await cmd.MyCommands(api, event);
        break;
      case "message_reaction":
        // handle messages_reaction
        break;
      case "message_reply":
        // handle reply
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error during event handling:", error);
  }
};

exports.listen = listen;