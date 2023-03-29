const { fetchTopics, fetchArticleById, fetchAllArticles } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((output) => {
      res.status(200).send({ topics: output });
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Invalid id' });
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
      const newArticles = articles.map(x => Object.assign({}, x, {
        comment_count: parseInt(x.comment_count) //Object.assign because could not use spread operator
      }));
      res.status(200).send(newArticles);
    })
    .catch(next);
}