/*
 * Copyright 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
var express = require("express");
var app = express();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 4242;
var ip = process.env.IP || '0.0.0.0';

app.use(cors());

http.listen(port, ip, function () {
  console.log('listening on ' + ip + ':' + port);
});

io.on('connection', function (socket) {
  console.log('User connected to chat!');

  socket.on('chatMessage', function (data) {
    console.log('[socket msg]', data);
    io.emit('chatMessage', data);
  });
});