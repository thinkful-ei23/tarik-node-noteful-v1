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
  res.json(data);
});