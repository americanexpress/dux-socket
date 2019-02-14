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
 
import React, { Component } from 'react';

import store from './store';
import {send} from '../../../../';
import ChatMessages from "./ChatMessages";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Native WebSocket Example</h1>
        </header>
        <p>
          <input type="text" defaultValue="" ref={(el => {
            this.input = el;
          })} />
          <input type="Submit" readOnly value="Send!" onClick={() => {
            // Dispatching with the `send` action creator
            store.dispatch(send(this.input.value));
          }} />
        </p>
        <ChatMessages />
      </div>
    );
  }
}

export default App;
