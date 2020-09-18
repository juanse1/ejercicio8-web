var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Joi = require("joi");
const $ = require("jquery");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const messages = [
    { message: "New Message", author: "Juan Jose Rodriguez", ts: 1599868276352 },
    { message: "New Message2", author: "la concha", ts: 1234567892222 },
    { message: "New Message3", author: "de la lora", ts: 1234567893333 },
];

// const messages = $.getJSON("messagesData.json", function(messages) {

// });

app.get("/chat/api/messages", (req, res) => {
    res.send(messages);
});

app.get("/chat/api/messages/:ts", (req, res) => {
    const message = messages.find((m) => m.ts === parseInt(req.params.ts));
    if (!message)
      return res.status(404).send("The message with the given ts was not found.");
    res.send(message);
});

app.post("/chat/api/messages", (req, res) => {
    const schema = Joi.object({
      message: Joi.string().min(5).required(),
      author: Joi.string().required(),
      ts: Joi.number().required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }
  
    const message = {
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    };
  
    messages.push(message);
    res.send(message);
});

app.put("/chat/api/messages/:ts", (req, res) => {
    const message = messages.find((m) => m.ts === parseInt(req.params.ts));
    if (!message)
      return res.status(404).send("The message with the given ts was not found.");
  
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().required(),
        ts: Joi.number().required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }
  
    message.message = req.body.message;
  
    res.send(message);
});
  
app.delete("/chat/api/messages/:ts", (req, res) => {
    const message = messages.find((m) => m.ts === parseInt(req.params.ts));
    if (!message)
      return res.status(404).send("The message with the given ts was not found.");
  
    const index = messages.indexOf(message);
    messages.splice(index, 1);
  
    res.send(message);
});

module.exports = app;
