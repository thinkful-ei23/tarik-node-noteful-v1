'use strict';

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const app = express();

const morgan = require('morgan')
const { PORT } = require('./config');

// Log all requests
app.use(morgan('dev'));

// ADD STATIC SERVER HERE
app.use(express.static('public'));

// Parse Request Body
app.use(express.json());



app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, function(err, list) {
    if (err) {
      return next(err);
    }
    return res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, function(err, item) {
    if (err) {
      return next(err);
    }
    return res.json(item);
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  notes.update(id, updateObj, function(err, item) {
    if (err) {
      return next(err);
    }
    if (item) {
      return res.json(item);
    } else {
      next();
    }
  });
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