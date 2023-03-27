const db = require("../db/connection");


exports.fetchTopics = () =>{
    
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
       return result.rows;
      });
}


exports.addTopics = (topicAdd) => {
    const arrayValue = [topicAdd.description, topicAdd.slug];
    const sql = `
    INSERT INTO topics
    (description, slug)
    VALUES
    ($1, $2)
    RETURNING *;
    `;
    return db.query( sql, arrayValue )
    .then(({rows}) => {
        const topicAdded = rows[0];
        if(!isNaN(topicAdded.description) || !isNaN(topicAdded.slug)) {
            return Promise.reject({status : 400, msg: 'Invalid field values.'});
        }
        return topicAdded;
    })
}