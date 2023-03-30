const { fetchTopics, fetchArticleById, fetchAllArticles, fetchComments } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((output) => {
      res.status(200).send({ topics: output });
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Invalid article ID' });
  }
  
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {

  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Invalid article ID' });
  }

  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};