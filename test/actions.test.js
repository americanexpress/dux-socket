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
 
const expect = require('chai').expect;

const emit = require('../src/index').emit;
const send = require('../src/index').send;
const initSocket = require('../src/index').initSocket;

describe('actions', () => {
  describe('emit', () => {
    it('should create an emit event', () => {
      expect(emit('foo', {bar: 'baz'})).to.deep.equal({
        type: 'dux-socket/EMIT',
        eventName: 'foo',
        data: {bar: 'baz'}
      });
    });
  });
  describe('send', () => {
    it('should create a send event', () => {
      expect(send({bar: 'baz'})).to.deep.equal({
        type: 'dux-socket/SEND',
        data: {bar: 'baz'}
      });
    });
  });
  describe('initSocket', () => {
    var fakeSocket = { foo: 'bar', baz: 'bat'};

    it('should create an init event', () => {
      expect(initSocket(fakeSocket)).to.deep.equal({
        type: 'dux-socket/INIT',
        socket: fakeSocket
      });
    });
  });
});