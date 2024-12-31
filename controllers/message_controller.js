const Messages = require("../models/message");
const User = require("../models/user");

module.exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    if(!from || !to) return res.status(500).json({error:error})

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        id:msg?._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    return res.status(200).json({projectedMessages})
  } catch (error) {
    return res.status(500).json({error:error})
  }
};

module.exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    let msg={
      fromSelf: data.sender.toString() === from,
      message: data.message.text,
    };
    let toEmailUser
    if(to) toEmailUser = await User.findById(to)
    if (data) return res.status(200).json({ msg,msgId:data._id,toEmailUser });
    else return res.status(500).json({ msg: "Failed to add message to the database" });
  } catch (error) {
    return res.status(500).json({error:error})
  }
};
