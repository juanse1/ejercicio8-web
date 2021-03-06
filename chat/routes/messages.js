var express = require("express");
var router = express.Router();

const ws = require("../wslib");
const Joi = require("joi");
const Message = require("../models/message");

router.get("/", function (req, res, next) {
    Message.findAll().then((result) => {
      res.send(result);
    });
});

router.get("/:id", (req, res) => {
    Message.findAll({where: {ts: req.params.id,},}).then((response) => {
      if (response === null)
        return res
          .status(404)
          .send("The message with the given ts was not found.");
      res.send(response);
    });
});

router.post("/", function (req, res, next) {

    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
        ts: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }

    Message.create({
        message: req.body.message,
        author: req.body.author,
        ts: req.body.ts,
    }).then((result) => {
        ws.sendMessages();
        res.send(result);
    });
});

router.put("/:id", (req, res) => {
    
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
        ts: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }

    Message.update(req.body, {where: { ts: req.params.id}}).then((response) => {
        if (response[0] !== 0) 
        {
            ws.sendMessages();
            res.send({ message: "Message updated" });
        } 
        else 
        {
            res.status(404).send("Message was not found");
        }
    });
});

router.delete("/:id", (req, res) => {

    Message.destroy({
        where: { 
            ts: req.params.id,
        },
    }).then((response) => {
        if (response === 1) {ws.sendMessages(); res.status(204).send();}
        else res.status(404).send({ message: "Message was not found" });
    });
});

module.exports = router;