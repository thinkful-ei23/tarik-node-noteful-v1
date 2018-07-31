'use strict';

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

// Load array of notes
const data = require('./db/notes');

const app = express();

const { requestLogger } = require('./middleware/logger');
const { PORT } = require('./config');

// ADD STATIC SERVER HERE
app.use(express.static('public'));
app.use(requestLogger);



app.get('/api/notes', (req, res) => {
  const query = req.query;
  let list = data;
  if (query.searchTerm) {
    list = list.filter(item => item.title.includes(query.searchTerm));
  }
  res.json(list);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const retNote = data.find(item => item.id === Number(id));
  res.json(retNote);
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function() {
  console.log(`Server is listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});