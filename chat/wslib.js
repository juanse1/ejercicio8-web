const WebSocket = require("ws");
const Joi = require("joi");
const Message = require("./models/message");

const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
    message = JSON.parse(message);

    const schema = Joi.object({
      message: Joi.string().min(5).required(),
      author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
      ts: Joi.number().required(),
    });

    const { error } = schema.validate(message.body);

    if(error)
    {
      console.log("esta sacando error el validate")
    }
    else
    {
      Message.create({
        message: message.message,
        author: message.author,
        ts: message.ts,
      });
    }
    sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    Message.findAll().then((result) => {
      var messages = [];
      result.forEach((message) => {
        messages.push(message.dataValues);
      });
      messages = JSON.stringify(messages);
      client.send(messages);
    });
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;