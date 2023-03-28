const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((output) => {
      res.status(200).send({ topics: output });
    })
    .catch((err) => {
      console.err(err);
      res.status(500).send({ err: "Unable to retrieve topics!" });
    });
};
