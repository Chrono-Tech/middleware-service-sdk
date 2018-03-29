'use strict';

const mocha = require('mocha');
const request = require('request');
const amqp = require('amqp-ts');
const expect = require('chai').expect;
const path = require('path');

const sdk = require('../index').init;
const server = require('../index').server;
const red = require('../index').red;
const migrator = require('../index').migrator;
const config = require('../config');

const clearMongoAccount = require('./helpers/clearMongoAccount');
const postAddress = require('./helpers/optionsOfRequests').postAddress;
const deleteAddress = require('./helpers/optionsOfRequests').deleteAddress;

let connection,
    queue;
    
    describe('testing API node-red', function() {
        before(() => {
            sdk(config);
            migrator.run(config.nodered.mongo.uri, path.join(__dirname, 'helpers/test_migrations'));
        });

        after(() => {
             queue.delete();
             red.stop();
             clearMongoAccount();
        })

        it('server start', (done) => {
            server.on('serverStart', function() {
                done()
            })
        });

        it('migration', (done) => {
            request.post('http://localhost:8081/admin/auth/token', {form: {username: 'admin', password: '123', client_id: 'node-red-editor', grant_type: 'password'}}, (err, res) => {
                if (err || res.statusCode !== 200) {
                    done(err || res.statusCode)
                } else {
                    done();
                }
            });
        });

        it('get events', (done) => {
            request('http://localhost:8081/events', (err, res) => {
                if (err || res.statusCode !== 200) {
                    done(err || res.statusCode);
                } else {
                    done()
                }
            })
        });

        it('add address', (done) => {
            request(postAddress, (err, res) => {
                if (err || res.statusCode !== 200) {
                    done(err || res.statusCode);
                } else {
                    done()
                }
            });
        });

        it('delete address', (done) => {
            request(deleteAddress, (err, res) => {
                if (err || res.statusCode !== 200) {
                    done(err || res.statusCode);
                } else {
                    done()
                }
            });
        });

        it('Sending Message to RabbitMQ Server', function(done){
            let content;

            setTimeout(function() {
                    connection = new amqp.Connection(config.rabbit.url);
                    request(postAddress);
                    queue = connection.declareQueue(`${config.rabbit.serviceName}.8910ae06.71de7`, {durable: false});
                    queue.activateConsumer(function(message) {
                        content = message.getContent();
                    }, {noAck: false}).then(() => {
                        try {
                            expect(content).to.not.be.undefined;
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                }, 400)
          });
    });

