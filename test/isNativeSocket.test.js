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
const isNativeSocket = require('../src/lib/isNativeSocket').default;

describe('isNativeSocket', () => {
  let socket;
  describe('when supplied with a Native WebSocket', () => {
    beforeEach(() => {
      global.WebSocket = function WebSocket() {};
      socket = new WebSocket;
    });
    it('should return true', () => {
      expect(isNativeSocket(socket)).to.equal(true);
    });
  });
  describe('when supplied with a non-native WebSocket', () => {
    beforeEach(() => {
      socket = {emit: function () {}};
    });
    it('should return false', () => {
      expect(isNativeSocket(socket)).to.equal(false);
    });
  });
  describe('when supplied non-objects', () => {
    it('should return false', () => {
      expect(isNativeSocket(null)).to.equal(false);
      expect(isNativeSocket(123)).to.equal(false);
      expect(isNativeSocket('')).to.equal(false);
    });
  });
  describe('when native WebSocket class is missing', () => {
    beforeEach(() => {
      delete global.WebSocket;
    });
    it('should return false (not throwing)', () => {
      expect(isNativeSocket()).to.equal(false);
      expect(isNativeSocket(123)).to.equal(false);
      expect(isNativeSocket({})).to.equal(false);
    });
  });
});