/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
'use strict';

const Promise = require('bluebird');
const request = require('request');
const amqp = require('amqp-ts');
const expect = require('chai').expect;

const config = require('./config');

const postAddress = require('./helpers/optionsOfRequests').postAddress;
const deleteAddress = require('./helpers/optionsOfRequests').deleteAddress;

//let connection, queue;
    
describe('testing API node-red', function () {
  // it('Sending Message to RabbitMQ Server', function (done){
  //   let content;
  //   const rabbit = config.nodered.functionGlobalContext.settings.rabbit;

  //   Promise.delay(400).then(() => {
  //     connection = new amqp.Connection(rabbit.url);
  //     request(postAddress);
  //     queue = connection.declareQueue(`${rabbit.serviceName}.8910ae06.71de7`, {durable: false});
  //     queue.activateConsumer(function (message) {
  //       content = message.getContent();
  //     }, {noAck: false}).then(() => {
  //       try {
  //         console.log(content);
  //         expect(content).to.not.be.undefined;
  //         done();
  //       } catch (err) {
  //         done(err);
  //       }
  //     });
  //   });
  // });

  it('add address', (done) => {
    request(postAddress, (err, res) => {
      (err || res.statusCode !== 200) ? done(err || res.statusCode) : done();
    });
  });

  it('delete address', (done) => {
    request(deleteAddress, (err, res) => {
      (err || res.statusCode !== 200) ? done(err || res.statusCode) : done();
    });
  });

  it('get events', (done) => {
    request('http://localhost:8081/events', (err, res) => {
      (err || res.statusCode !== 200) ? done(err || res.statusCode) : done();
    });
  });

  it('get auth right', (done) => {
    request('http://localhost:8081/secret', {'headers': {Authorization: 'Bearer ' + 
      config.dev.signature}}, (err, res) => {
      if (err || res.statusCode !== 200) 
        return done(err || res.statusCode);
      expect(JSON.parse(res.body), {
        'ethereum-public-key': config.dev['ethereum-public-key'], 
        'nem-address': config.dev['nem-address']
      });
      done();
    });
  });


  it('get auth right from db', (done) => {
    request('http://localhost:8081/secret', {'headers': {Authorization: 'Bearer ' + 
      config.dev.signature}}, (err, res) => {
      if (err || res.statusCode !== 200) 
        return done(err || res.statusCode);
      expect(JSON.parse(res.body), {
        'ethereum-public-key': config.dev['ethereum-public-key'], 
        'nem-address': config.dev['nem-address']
      });
      done();
    });
  });

  it('get auth error 400', (done) => {
    request('http://localhost:8081/secret', (err, res) => {
      (err || res.statusCode !== 400) ? done(err || res.statusCode) : done();
    });
  });

  it('get auth error 401', (done) => {
    request('http://localhost:8081/secret',{'headers': {Authorization: 'Bearer token1243'}}, 
      (err, res) => {
        (err || res.statusCode !== 401) ? done(err || res.statusCode) : done();
      });
  });
});

