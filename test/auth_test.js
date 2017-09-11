const Auth = require('../');

describe('Auth', function() {
  afterEach(function() {
    window.localStorage.clear();
  });

  describe('.isSignedIn', function() {
    it('is false by default', function() {
      expect(Auth.isSignedIn()).to.be.false;
    });

    it('is true if there is a non-expired token present in storage', function() {
      const twoWeeksInMs = ((24 * 60 * 60) * 14) * 1000;

      window.localStorage.setItem('authToken', JSON.stringify({
        'access-token': 'a-non-expired-token',
        client: 'email',
        expiry: (Date.now() + twoWeeksInMs) / 1000,
        uid: 'email@example.com'
      }));

      expect(Auth.isSignedIn()).to.be.true;
    });

    it('is false if the token is expired', function() {
      const yesterday = Date.now() - ((24 * 60 * 60) * 1000);

      window.localStorage.setItem('authToken', JSON.stringify({
        'access-token': 'an-expired-token',
        client: 'email',
        expiry: yesterday / 1000,
        uid: 'email@example.com'
      }));

      expect(Auth.isSignedIn()).to.be.false;
    });
  });

  describe('.persistToken', function() {
    it('persists the auth token from response headers', function() {
      const headers = {
        'access-token': 'my-secure-token',
        client: 'email',
        'Content-Type': 'application/json',
        expiry: ((24 * 60 * 60) * 14),
        uid: 'email@example.com'
      };

      Auth.persistToken(new Headers(headers));

      expect(window.localStorage.getItem('authToken')).to.eql(JSON.stringify({
        'token-type': 'Bearer',
        'access-token': headers['access-token'],
        client: headers.client,
        expiry: String(headers.expiry),
        uid: headers.uid
      }));
    });
  });

  describe('.removeToken', function() {
    beforeEach(function() {
      window.localStorage.setItem('authToken', JSON.stringify({
        'access-token': 'a-token',
        client: 'email',
        expiry: ((24 * 60 * 60) * 10),
        uid: 'email@example.com'
      }));
    });

    it('clears the persisted token from storage', function() {
      Auth.removeToken();

      expect(window.localStorage.getItem('authToken')).not.to.exist;
    });
  });

  describe('.requestHeaders', function() {
    const twoWeeksInSec = (24 * 60 * 60) * 14;

    beforeEach(function() {
      window.localStorage.setItem('authToken', JSON.stringify({
        'token-type': 'Bearer',
        'access-token': 'my-token',
        client: 'email',
        expiry: twoWeeksInSec,
        uid: 'email@example.com'
      }));
    });

    it('retrieves the auth headers needed to send a request as a plain object', function() {
      expect(Auth.requestHeaders()).to.eql({
        'token-type': 'Bearer',
        'access-token': 'my-token',
        client: 'email',
        expiry: twoWeeksInSec,
        uid: 'email@example.com'
      });
    });
  });

  describe('setStorage', function() {
    it('replaces the default storage with a custom object', function() {
      const myStorage = {
        getItem: sinon.spy(),
        setItem: sinon.spy(),
        removeItem: sinon.spy()
      };

      Auth.setStorage(myStorage);

      Auth.isSignedIn();

      expect(myStorage.getItem).to.be.calledOnce;

      Auth.persistToken(new Headers({ 'auth-token': 'my-token' }));

      expect(myStorage.setItem).to.be.calledOnce;

      Auth.removeToken();

      expect(myStorage.removeItem).to.be.calledOnce;
    });

    it('throws an error if storage is not implemented correctly', function() {
      let storage = {};

      expect(() => Auth.setStorage(storage)).to.throw();

      storage.getItem = sinon.spy();

      expect(() => Auth.setStorage(storage)).to.throw();

      storage.setItem = sinon.spy();

      expect(() => Auth.setStorage(storage)).to.throw();

      storage.removeItem = sinon.spy();

      expect(() => Auth.setStorage(storage)).not.to.throw();
    });
  });
});
