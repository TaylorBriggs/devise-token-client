'use strict';

(function() {
  const AUTH_TOKEN = 'authToken';
  const AUTH_FIELDS = ['access-token', 'client', 'expiry', 'uid'];
  const STORAGE_ERR = 'Storage must implement `getItem`, `setItem`, and `removeItem`';

  let storage = window.localStorage;

  function isFunction(maybeFunc) {
    return typeof maybeFunc === 'function';
  }

  function isValidStorage({ getItem, setItem, removeItem }) {
    return isFunction(getItem) && isFunction(setItem) && isFunction(removeItem);
  }

  function getAuth() {
    const auth = storage.getItem(AUTH_TOKEN);

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
    const auth = getAuth();
    const token = auth['access-token'];
    const expiryInMs = parseInt(auth.expiry, 10) * 1000;

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
