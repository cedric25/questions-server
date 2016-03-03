'use strict';

const questions = require('./questions.json');
const fibo = require('./fibo.js');

const maxNumberOperations = 100;
const maxNumberFibo = 20;

/**
 *
 */
module.exports = (client) => {

  let random = Math.floor(Math.random() * questions.length);
  let question = JSON.parse(JSON.stringify(questions[random]));

  let reg1 = /Combien font ([0-9]+) plus ([0-9]+) ?/i;
  let reg2 = /Combien font ([0-9]+) fois ([0-9]+) ?/i;
  let reg3 = /Quel est le nombre en position ([0-9]+) de la suite de Fibonacci \(commençant par 0\) ?/i;

  if (question.q.match(reg1)) {
    let x = Math.floor(Math.random() * maxNumberOperations);
    let y = Math.floor(Math.random() * maxNumberOperations);
    question.q = `Combien font ${x} plus ${y} ?`;
    question.a = x + y + '';
  }
  else if (question.q.match(reg2)) {
    let x = Math.floor(Math.random() * maxNumberOperations);
    let y = Math.floor(Math.random() * maxNumberOperations);
    question.q = `Combien font ${x} fois ${y} ?`;
    question.a = x * y + '';
  }
  else if (question.q.match(reg3)) {
    let x = Math.floor(Math.random() * maxNumberFibo);
    question.q = `Quel est le nombre en position ${x} de la suite de Fibonacci (commençant par 0) ?`;
    question.a = fibo(x) + '';
  }
  else if (question.p === 'Trigramme') {
    question.a = client.name;
  }

  return question;
};
