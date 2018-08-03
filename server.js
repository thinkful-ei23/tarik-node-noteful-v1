'use strict';

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');


const app = express();

const morgan = require('morgan');
const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');

// Log all requests
app.use(morgan('dev'));

// ADD STATIC SERVER HERE
app.use(express.static('public'));

// Parse Request Body
app.use(express.json());

app.use('/api', notesRouter);

let server;

function runServer() {
  const port = PORT;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}


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

// Listening for incoming connections
if (require.main === module) {
  app.listen(PORT, function() {
    console.log(`Server is listening on ${PORT}`);
  }).on('error', err => {
    console.log(err);
  });
}

module.exports = { app, runServer, closeServer }; // Export for testing