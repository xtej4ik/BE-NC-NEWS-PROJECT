const {
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchComments,
  addNewComment
} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((output) => {
    res.status(200).send({ topics: output });
  });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Invalid article ID" });
  }

  fetchArticleById(article_id)
    .then((article) => {
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
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Invalid article ID" });
  }

  fetchArticleById(article_id)
    .then((article) => {
      return fetchComments(article.article_id)
        .then((comments) => {
          res.status(200).send({ comments });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
};
exports.postComments = (req, res, next) => {
  const commentToAdd = req.body;

  if (!commentToAdd.body) {
    res.status(400).send({ msg: "Invalid request body" });
  } else if (!commentToAdd.username) {
    res.status(400).send({ msg: "Username is required" });
  } else if(isNaN(req.params.article_id)) {
    res.status(400).send({ msg: "Invalid article ID" });
  } else {
    fetchArticleById(req.params.article_id)
      .then(article => {
        return addNewComment({
          article_id: parseInt(article.article_id),
          username: commentToAdd.username,
          body: commentToAdd.body,
        }).then((comment) => {
          res.status(201).send({ comment });
        })
          .catch(err => {
            next(err)
          })
      })
      .catch((err) => {
        next(err);
      })
  }
};
