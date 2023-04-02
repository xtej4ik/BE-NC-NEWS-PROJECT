const db = require("../db/connection");


exports.fetchTopics = () =>{
    
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
       return result.rows;
      });
}
exports.fetchArticleById = (article_id) => {
    return db.query(`
    SELECT articles.*, 
    COUNT(comments.comment_id) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
      .then(result => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: `Article ${article_id} not found` });
        }
        return result.rows[0];
      });
  };

  exports.fetchAllArticles = (topic, sort_by, order) => { 
    if(!sort_by) {
      sort_by = "created_at";
    }

    if(!order) {
      order = "desc";
    }

    if(!['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
    .includes(sort_by)) {
      return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
    } else if(order !== "asc" && order !== "desc") {
      return Promise.reject({ status: 400, msg: 'Invalid sort order' });
    }

    const parameters = []
    let sql = `
    SELECT articles.*, 
    COUNT(comments.comment_id) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    if(topic) {
      sql += ` WHERE articles.topic = $1`
      parameters.push(topic)
    }
  
    sql += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()};`

    return db.query(sql, parameters)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: 'No articles found' });
      }
      return result.rows;
    });
  };

  exports.fetchComments = (article_id) => {
    const sql = `
    SELECT comments.*
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC;
    `
    return db.query(sql, [article_id])
    .then((result) => {
      return result.rows;
    });
  };

  exports.addNewComment = (commentAdd) => {
    const { username, body, article_id } = commentAdd;
  
    return db
      .query(`SELECT * FROM users WHERE username = $1`, [username])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 400, msg: 'Invalid username' });
        }
  
        const arrayValue = [username, body, article_id];
        const sql = `
          INSERT INTO comments
          (author, body, article_id)
          VALUES
          ($1, $2, $3)
          RETURNING *;
        `;
        return db.query(sql, arrayValue);
      })
      .then(({ rows }) => {
        const commentAdded = rows[0];
        return commentAdded;
      });
  };

  exports.incrementArticleVotes = (article_id, inc) => {

    if (isNaN(inc)) {
      return Promise.reject({ status: 400, msg: 'Invalid vote value' });
    }

    const sql = `
      UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *;
    `;
  
    return db.query(sql, [article_id, inc])
      .then(({ rows }) => {
        if(rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return rows[0];
      });
  };

  exports.deleteCommentById = (comment_id) => {
    if (isNaN(comment_id)) {
      return Promise.reject({ status: 400, msg: 'Invalid comment ID' });
    }
    const sql = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
    return db
      .query(sql, [comment_id])
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject({ status: 404, msg: 'Comment not found' });
        }
        return result.rows[0];
      });
  };

  exports.fetchAllUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((result) => {
      return result.rows;
    });
};