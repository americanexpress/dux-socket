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

export const SOCKET_INIT = 'dux-socket/INIT';
export const SOCKET_EMIT = 'dux-socket/EMIT';
export const SOCKET_SEND = 'dux-socket/SEND';

export const initSocket = socket => ({
  type: SOCKET_INIT,
  socket,
});

// Native WebSocket
export const send = data => ({
  type: SOCKET_SEND,
  data,
});

// Socket.IO
export const emit = (eventName, data) => ({
  type: SOCKET_EMIT,
  eventName,
  data,
});
