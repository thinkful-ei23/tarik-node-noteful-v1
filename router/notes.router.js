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

module.exports = router;