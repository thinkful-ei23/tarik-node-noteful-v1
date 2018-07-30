'use strict';

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

// Load array of notes
const data = require('./db/notes');

const app = express();

// ADD STATIC SERVER HERE

app.listen(8080, function() {
  console.log(`Server is listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});

app.get('/api/notes', (req, res) => {
  const query = req.query;
  let list = data;
  if (query.searchTerm) {
    list = list.filter(item => item.title.indexOf(query.searchTerm) !== -1);
  }
  res.json(list);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const retNote = data.find(item => item.id === Number(id));
  res.json(retNote);
});