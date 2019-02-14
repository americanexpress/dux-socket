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

import wire from './wire';
import { SOCKET_INIT, SOCKET_EMIT, SOCKET_SEND } from './actions';
import isNativeSocket from './isNativeSocket';
import isObject from './isObject';

const socketMiddleware = (mapDispatchToSocket, initialSocket) => (store) => {
  let socket;

  if (typeof mapDispatchToSocket !== 'function') {
    throw new TypeError('[dux-socket] mapDispatchToSocket provided to middleware is not a function. Please refer to the documentation.');
  }

  const dispatchToSocketMap = mapDispatchToSocket(store.dispatch);

  if (isObject(dispatchToSocketMap) === false) {
    throw new TypeError('[dux-socket] mapDispatchToSocket function provided to middleware did not return an object. Please refer to the documentation.');
  }

  if (initialSocket) {
    socket = initialSocket;
    wire(socket, dispatchToSocketMap);
  }

  return next => (action) => {
    const { type } = action;

    switch (type) {
      case SOCKET_INIT:
        socket = action.socket; // eslint-disable-line prefer-destructuring
        wire(socket, dispatchToSocketMap);
        break;

      case SOCKET_EMIT: // Socket.IO
        if (isNativeSocket(socket)) {
          throw new Error('[dux-socket] an `emit` action was dispatched but the socket supplied is a native WebSocket. Did you mean to use `send(data)` instead?');
        }
        socket.emit(action.eventName, action.data);
        break;

      case SOCKET_SEND: // Native WebSockets
        if (!isNativeSocket(socket)) {
          throw new Error('[dux-socket] a `send` action was dispatched but the socket supplied is not a native WebSocket. Did you mean to use `emit(eventName, data)` instead?');
        }
        socket.send(action.data);
        break;

      default:
    }
    return next(action);
  };
};

export default socketMiddleware;
