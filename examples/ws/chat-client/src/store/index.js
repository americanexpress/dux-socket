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
 
import {createStore, applyMiddleware} from 'redux';
import {socketMiddleware} from '../../../../../';
import appReducer from '../reducers';

let socket = new WebSocket('ws://localhost:4242');

const mapDispatchToSocket = (dispatch) => ({
  'onmessage': (event) => dispatch({ type: 'CHAT_MESSAGE', message: event.data }),
  'onerror': (e) => dispatch({ type: 'ERROR', msg: 'Connection error!' })
});

const store = createStore(
  appReducer,
  applyMiddleware(socketMiddleware(mapDispatchToSocket, socket))
);

export default store;
