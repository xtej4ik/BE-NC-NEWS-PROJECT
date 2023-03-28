const express = require('express')

const { getTopics } = require("./controllers/topics.controllers")

const app = express();

app.use(express.json())

app.get('/api', (req, res) => {
    res.status(200).send({msg: 'Server is up and running'})
});

app.get('/api/topics', getTopics);


// to catch all wrong path
app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  });

  

module.exports = app;
