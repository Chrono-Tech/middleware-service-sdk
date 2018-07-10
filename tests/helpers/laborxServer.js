/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
var express = require('express');
var app = express();

const TOKEN = 'token123';

// respond with "hello world" when a GET request is made to the homepage
app.post('/signin/signature/addresses', function(req, res) {
  if (!req.headers.authorization) res.send(400, 'missing authorization header');
  
  const params = req.headers.authorization.split(' ');
  if (params[0] == 'Bearer' && params[1] == TOKEN) {
    res.send(JSON.stringify({
      address: 'sdfsdfsdfsfsd',
      'nem-address': 'dfsdfsdfsdf'
    }));
    return;
  }
  res.send(401, 'not right authorization token');
});


