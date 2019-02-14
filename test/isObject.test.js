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
const isObject = require('../src/lib/isObject').default;

describe('isObject', () => {
  describe('when supplied with non-null objects', () => {
    it('should return true', () => {
      expect(isObject(new Object())).to.equal(true);
      expect(isObject({})).to.equal(true);
      expect(isObject(new Number(123))).to.equal(true);
    });
  });
  describe('when supplied with null', () => {
    it('should return false', () => {
      expect(isObject(null)).to.equal(false);
    });
  });
  describe('when supplied with non-objects', () => {
    it('should return false', () => {
      expect(isObject(123)).to.equal(false);
      expect(isObject(function() {})).to.equal(false);
      expect(isObject('')).to.equal(false);
    });
  });
});