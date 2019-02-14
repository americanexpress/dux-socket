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
 
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
const wire = require('../src/lib/wire').default;

describe('wire', () => {
  let onCalls, events, socket, socketToDispatchMap;

  beforeEach(() => {
    onCalls = [];
    events = {
      someEventA: false
    };
    socket = { on: function (evt, fn) {
      onCalls.push([evt, fn]); }
    };
    socketToDispatchMap = {
      'someEventA': function () { events.someEventA = true; }
    };
    wire(socket, socketToDispatchMap);
  });

  describe('before registered events are invoked', () => {
    it('should register events properly', function () {
      assert.equal(onCalls[0][0], 'someEventA');
      assert.equal(onCalls[0][1] instanceof Function, true);
    });
    it('should not execute dispatch map functions', () => {
      assert.equal(events.someEventA, false);
    });
  });

  describe('when registered events are invoked', () => {
    beforeEach(() => {
      onCalls[0][1]();
    });
    it('should execute the relevant dispatch map functions', () => {
      assert.equal(events.someEventA, true);
    });
  });

  describe('error handling', function () {
    let wireExec = (...args) => () => wire(...args);
    let socketObjErr = /Did you provide the Socket object?/;
    let dispatchMapPropErr = /property was not a function/;
    let dispatchMapObjErr = /is not an Object/;

    describe('when improper Socket object supplied', () => {
      it('should throw error', function () {
        expect(wireExec({}, {})).to.throw(TypeError, socketObjErr);
        expect(wireExec(null, {})).to.throw(TypeError, socketObjErr);
        expect(wireExec('', {})).to.throw(TypeError, socketObjErr);
      });
    });
    describe('when improper socketToDispatchMap object supplied', () => {
      let fakeSocket = {on: function(){}};
      it('should throw error', function () {
        expect(wireExec(fakeSocket, {foo:'bar'})).to.throw(TypeError, dispatchMapPropErr);
        expect(wireExec(fakeSocket, null)).to.throw(TypeError, dispatchMapObjErr);
        expect(wireExec(fakeSocket, '')).to.throw(TypeError, dispatchMapObjErr);
      });
    });
  });
});