'use strict';

(function() {
  var AUTH_TOKEN = 'authToken';
  var AUTH_FIELDS = ['access-token', 'client', 'expiry', 'uid'];
  var STORAGE_ERR = 'Storage must implement `getItem`, `setItem`, and `removeItem`';

  var storage = window.localStorage;

  function isFunction(maybeFunc) {
    return typeof maybeFunc === 'function';
  }

  function isValidStorage({ getItem, setItem, removeItem }) {
    return isFunction(getItem) && isFunction(setItem) && isFunction(removeItem);
  }

  function getAuth() {
    var auth = storage.getItem(AUTH_TOKEN);

    if (auth) return JSON.parse(auth);

    return {};
  }

  function parseHeaders(headers) {
    return AUTH_FIELDS.reduce((memo, field) => {
      memo[field] = headers.get(field);

      return memo;
    }, { 'token-type': 'Bearer' });
  }

  function isSignedIn() {
    var auth = getAuth();
    var token = auth['access-token'];
    var expiryInMs = parseInt(auth.expiry, 10) * 1000;

    return !!(token && expiryInMs && Date.now() < expiryInMs);
  }

  function persistToken(headers) {
    storage.setItem(AUTH_TOKEN, JSON.stringify(parseHeaders(headers)));
  }

  function removeToken() {
   storage.removeItem(AUTH_TOKEN);
  }

  function requestHeaders() {
    return getAuth();
  }

  function setStorage(customStorage) {
    if (!isValidStorage(customStorage)) {
      throw new Error(STORAGE_ERR)
    }

    storage = customStorage;
  }

  exports.isSignedIn = isSignedIn;
  exports.persistToken = persistToken;
  exports.removeToken = removeToken;
  exports.requestHeaders = requestHeaders;
  exports.setStorage = setStorage;
}).call(this);
