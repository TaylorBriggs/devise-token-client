# devise-token-client

A standalone JavaScript client for the [devise_token_auth] ruby gem.


## Installation

Use yarn or npm:

    $ yarn add devise-token-client
    # OR
    $ npm install --save devise-token-client

`devise-token-client` is made for use in the browser, but assumes you are using
a tool like [webpack] to build modules.

## Usage

If you are using a transpiler such as `babel`, you can `import` individual
functions or the entire module like so:

```javascript
import { isSignedIn } from 'devise-token-client';
import * as Auth from 'devise-token-client';
```

If you are using CommonJS style requires, you would use the module like so:

```javascript
const Auth = require('devise-token-client');
const isSignedIn = require('devise-token-client').isSignedIn;
```

### API

#### `isSignedIn()`

Returns a boolean of whether or not the current user has authenticated with
the server. It will return `false` if there is an expired token in storage.

#### `persistToken(headers)`

Takes `headers` (must be an instance of [Headers]) and persists relevant auth
fields to storage.

#### `removeToken()`

Removes a persisted token from storage, effectively signing out the current user.

#### `requestHeaders()`

Returns a plain object that can be used to construct [Headers] that need to be
included with the next request to the server.

#### `setStorage(customStorage)`

`devise-token-client` uses `window.localStorage` by default.
If you want to provide your own storage mechanism, it should implement the
same methods (and method signatures) as `window.localStorage`.

For example:

```javascript
const Auth = require('devise-token-client');

const customStorage = {
  getItem(key) {
    // return the value for key
  },
  setItem(key, value) {
    // persist value for key
  },
  removeItem(key) {
    // get rid of value for key
  }
}

Auth.setStorage(customStorage);
```

[Headers]: https://developer.mozilla.org/en-US/docs/Web/API/Headers
[devise_token_auth]: https://github.com/lynndylanhurley/devise_token_auth
[webpack]: https://github.com/webpack/webpack
