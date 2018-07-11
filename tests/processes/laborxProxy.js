/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const express = require('express'),
  app = express(),
  config = require('../config');

// respond with "hello world" when a GET request is made to the homepage
app.post('/signin/signature/addresses', function(req, res) {
  if (!req.headers.authorization) res.status(400).send('missing authorization header');
  
  const params = req.headers.authorization.split(' ');
  if (params[0] === 'Bearer' && params[1] === config.dev.token) {
    res.status(200).send(JSON.stringify({
      address: config.dev.address,
      'nem-address': config.dev['nem-address']
    }));
    return;
  }
  res.status(401).send('not right authorization token');
});


app.listen(config.dev.proxyPort, function () {
  console.log('proxy listening on port ' + config.dev.proxyPort  + '!');
});



