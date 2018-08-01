'use strict';

// Import express module
const express = require('express');

// Create Express router
const router = express.Router();

// Import simulation database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, function(err, list) {
    if (err) {
      return next(err);
    }
    return res.json(list);
  });
});
  
router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, function(err, item) {
    if (err) {
      return next(err);
    }
    return res.json(item);
  });
});
  
router.put('/notes/:id', (req, res, next) => {
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

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content};
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  notes.delete(id, (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(204).json('No content');
    }
  });
});

module.exports = router;