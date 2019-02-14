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
 
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const should = chai.should();
const expect = chai.expect;

const socketMiddleware = require('../src/index').socketMiddleware;

describe('middleware', () => {
  let nextMiddleWare, store, socket, mapDispatchToSocket, dispatchToSocketMap, storeRecvFn, nextRecvFn, actionRecvFn;

  beforeEach(() => {
    nextMiddleWare = chai.spy();
    store = {dispatch: chai.spy()};
    dispatchToSocketMap = {'someEvent': () => ({type: 'foo'})};
    mapDispatchToSocket = chai.spy.returns(dispatchToSocketMap);
  });

  describe('Socket.IO', () => {
    beforeEach(() => {
      socket = {emit: chai.spy(), on: chai.spy()};
    });
    describe('synchronous socket initalization', () => {
      beforeEach(() => {
        storeRecvFn = socketMiddleware(mapDispatchToSocket, socket);
        nextRecvFn = storeRecvFn(store);
        actionRecvFn = nextRecvFn(nextMiddleWare);
      });

      it('should wire synchronously to the supplied socket events', () => {
        expect(socket.on).to.have.been.called.with('someEvent');
      });

      it('should invoke mapDispatchToSocket with store.dispatch', () => {
        expect(mapDispatchToSocket).to.have.been.called.with(store.dispatch);
      });

      describe('before receiving actions', () => {
        it('should not invoke middleware chain', () => {
          expect(nextMiddleWare).not.to.have.been.called();
        });
      });

      describe('when receiving unrelated actions', () => {
        beforeEach(() => {
          actionRecvFn({ type: 'any' });
        });
        it('should chain properly', () => {
          expect(nextMiddleWare).to.have.been.called();
        });
        it('should not emit a socket event', () => {
          expect(socket.emit).not.to.have.been.called();
        });
      });

      describe('when receiving actions meant for Socket.IO', () => {
        beforeEach(() => {
          actionRecvFn({ type: 'dux-socket/EMIT', eventName: 'messageRecv', data: {user: 'bob'} });
        });
        it('should chain properly', () => {
          expect(nextMiddleWare).to.have.been.called();
        });
        it('should emit a socket event', () => {
          expect(socket.emit).to.have.been.called.with('messageRecv', {user: 'bob'});
        });
      });

      describe('when receiving actions meant for native WebSockets', () => {
        it('should throw an error', () => {
          expect(() => {
            actionRecvFn({ type: 'dux-socket/SEND', data: 'foo' });
          }).to.throw(Error, /use `emit\(eventName, data\)`/);
        });
      });

    });

    describe('asynchronous socket initalization', () => {
      beforeEach(() => {
        storeRecvFn = socketMiddleware(mapDispatchToSocket);
        nextRecvFn = storeRecvFn(store);
        actionRecvFn = nextRecvFn(nextMiddleWare);
      });

      it('should not attempt to wire to the supplied events', () => {
        expect(socket.on).not.to.have.been.called();
      });

      describe('after receiving socket init action', () => {
        beforeEach(() => {
          actionRecvFn({ type: 'dux-socket/INIT', socket });
        });
        it('should chain properly', () => {
          expect(nextMiddleWare).to.have.been.called();
        });
        it('should wire to the supplied events', () => {
          expect(socket.on).to.have.been.called.with('someEvent');
        });

        describe('when receiving socket events', () => {
          beforeEach(() => {
            actionRecvFn({ type: 'dux-socket/EMIT', eventName: 'messageRecv', data: {user: 'bob'} });
          });

          it('should emit a socket event', () => {
            expect(socket.emit).to.have.been.called.with('messageRecv', {user: 'bob'});
          });
        });
      });
    });
  });

  describe('Native WebSockets', () => {
    beforeEach(() => {
      global.WebSocket = function WebSocket() {
        this.send = chai.spy();
      };
      socket = new WebSocket();
    });
    describe('synchronous socket initialization', () => {
      beforeEach(() => {
        storeRecvFn = socketMiddleware(mapDispatchToSocket, socket);
        nextRecvFn = storeRecvFn(store);
        actionRecvFn = nextRecvFn(nextMiddleWare);
      });

      it('should wire synchronously to the supplied socket handler props', () => {
        expect(socket.someEvent).to.equal(dispatchToSocketMap.someEvent);
      });

      it('should invoke mapDispatchToSocket with store.dispatch', () => {
        expect(mapDispatchToSocket).to.have.been.called.with(store.dispatch);
      });

      describe('when receiving actions meant for native WebSockets', () => {
        beforeEach(() => {
          actionRecvFn({ type: 'dux-socket/SEND', data: {user: 'bob'} });
        });
        it('should chain properly', () => {
          expect(nextMiddleWare).to.have.been.called();
        });
        it('should emit a socket event', () => {
          expect(socket.send).to.have.been.called.with({user: 'bob'});
        });
      });

      describe('when receiving actions meant for Socket.IO', () => {
        it('should throw an error', () => {
          expect(() => {
            actionRecvFn({ type: 'dux-socket/EMIT', eventName: 'foo', data: 'bar' });
          }).to.throw(Error, /use `send\(data\)`/);
        });
      });
    });
  });

  describe('error handling', () => {
    const mapDispatchErr = /mapDispatchToSocket provided to middleware is not a function/;
    const eventMapErr = /mapDispatchToSocket function provided to middleware did not return an object/;
    const mapSocketFn = (returns) => () => returns;

    describe('when invalid mapDispatchToSocket function is supplied', () => {
      it('should throw', () => {
        expect(function () {socketMiddleware()(store);}).to.throw(TypeError, mapDispatchErr);
        expect(function () {socketMiddleware(null)(store);}).to.throw(TypeError, mapDispatchErr);
        expect(function () {socketMiddleware('')(store);}).to.throw(TypeError, mapDispatchErr);
        expect(function () {socketMiddleware(123)(store);}).to.throw(TypeError, mapDispatchErr);
      });
    });
    describe('when invalid event map is supplied by mapDispatchToSocket', () => {
      it('should throw', () => {
        expect(function () {socketMiddleware(mapSocketFn())(store);}).to.throw(TypeError, eventMapErr);
        expect(function () {socketMiddleware(mapSocketFn(null))(store);}).to.throw(TypeError, eventMapErr);
        expect(function () {socketMiddleware(mapSocketFn(''))(store);}).to.throw(TypeError, eventMapErr);
        expect(function () {socketMiddleware(mapSocketFn(123))(store);}).to.throw(TypeError, eventMapErr);
      });
    });
  });
});