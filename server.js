'use strict';

const Hapi = require('hapi');
const Path = require('path');
const request = require('request');

// Node utilities shared amongst the extended hapi universe
const Hoek = require('hoek');

// Static file and directory handlers
const Inert = require('inert');

// Templates rendering support
const Vision = require('vision');

// List of clients
const clients = require('./server/clients.json');

const generateQuestion = require('./server/generateQuestion.js');

const refreshInterval = 3000;

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});

server.connection({
  host: 'localhost',
  port: 8000
});

server.register([Inert, Vision], (err) => {

  Hoek.assert(!err, err);

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });

  /**
   * --- HOME ---
   */
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.view('index', { clients: clients });
    }
  });

  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);

    console.log('Starting to call clients...');
    initClients();
    echoFor();
    setInterval(echoFor, refreshInterval);
  });

});

// -------------------------
//         FUNCTIONS
// -------------------------

/**
 *
 */
function initClients() {
  for (var client of clients) {
    client.score = '';
  }
}

/**
 *
 */
function echoFor() {
  console.log('-------------------------');
  for (var client of clients) {
    if (client.ip) {
      //checkIfHello(client);
      askQuestions(client);
    }
  }
}

/**
 *
 */
function checkIfHello(client) {
  console.log('> checkIfHello() - ' + client.name);
  let url = `http://${client.ip}/echo`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log(`Congrats ${client.name} :-)`);
      client.echo = true
    }
  })
}

/**
 *
 */
function askQuestions(client) {

  let question = generateQuestion(client);

  let url = `http://${client.ip}/question`;
  console.log(client.name + ' - Question: ' + question.q);
  request.post(url, {form: {question: question.q}}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      if (body && body.toLowerCase() === question.a.toLowerCase()) {
        console.log(client.name + ' --> Good one!');
        client.score += '-';
        displayScores();
      }
    }
  });
}

/**
 *
 */
function displayScores() {
  console.log('========');
  console.log(' SCORES');
  for (var client of clients) {
    console.log(client.name + ' --> ' + client.score);
  }
  console.log('========');
}
