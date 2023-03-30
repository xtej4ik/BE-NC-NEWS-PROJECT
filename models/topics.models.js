const db = require("../db/connection");


exports.fetchTopics = () =>{
    
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
       return result.rows;
      });
}
exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then(result => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: `Article ${article_id} not found` });
        }
        return result.rows[0];
      });
  };

  exports.fetchAllArticles = () => { 
    return db.query //using subquery 
    (`
    SELECT articles.*, 
    (SELECT COUNT (comments.comment_id) FROM comments WHERE comments.article_id = articles.article_id) 
    AS comment_count
    FROM articles
    ORDER BY created_at DESC;
    `,)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: 'No articles found' });
      }
      return result.rows;
    });
  };