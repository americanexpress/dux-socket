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

import isNativeSocket from './isNativeSocket';
import isObject from './isObject';

const addEventNative = (socket, socketMsg, fn) => {
  socket[socketMsg] = fn; // eslint-disable-line no-param-reassign
};
const addEventSocketIo = (socket, socketMsg, fn) => {
  socket.on(socketMsg, fn);
};

export default function wire(socket, socketEventMap) {
  const isNative = isNativeSocket(socket);
  const addEvent = isNative ? addEventNative : addEventSocketIo;

  if (!isNative) {
    if (!isObject(socket) || typeof socket.on !== 'function') {
      throw new TypeError('[dux-socket] Improper Socket object detected. Did you provide the Socket object?');
    }
  }

  if (!isObject(socketEventMap)) {
    throw new TypeError('[dux-socket] Socket event map is not an Object. Please refer to the documentation.');
  }

  Object.entries(socketEventMap).forEach(([socketMsg, fn]) => {
    if (typeof fn !== 'function') {
      throw new TypeError(`[dux-socket] Socket event map property was not a function for socket message '${socketMsg}'. Please refer to the documentation for mapDispatchToSocket.`);
    }
    addEvent(socket, socketMsg, fn);
  });
}
