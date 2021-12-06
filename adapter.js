const request = require('superagent');

const paths = {
  auth: '/oauth2/connect/token',
  location: '/v1/master/locations',
  courier: '/v1/couriers',
};

const SicepatAdapter = function () {
  const adapter = {
    getConnection: function() {
      return this.connection || SICEPAT_URL;
    },
    getLocation: function(params) {
      const url = this.getConnection() + paths.location;
      return dispatchRequest('POST', url, {
        args: params
      });
    },
  }

  return adapter;
};

async function auth() {
  return new Promise(function(resolve, reject) {
    request('POST', SICEPAT_AUTH_URL + paths.auth)
      .timeout(10000)
      .set({
        Authorization: 'Basic ' + SICEPAT_API_KEY
      })
      .send({
        grant_type: 'client_credentials'
      })
      .end(handleResponse(resolve, reject));
  });
}

async function dispatchRequest(method, url, params) {
  let timeout = 30000000;

  const authResponse = (await auth()).body;
  authBearer = authResponse.accessToken;

  let header = {
    Authorization: 'Bearer ' + authBearer
  };

  return new Promise(function (resolve, reject) {
    request(method, url)
      .timeout(params.timeout || timeout)
      .set('Content-Type', 'application/json')
      .set(header)
      .send(params.args)
      .end(handleResponse(resolve, reject, params));
  });
}

function handleResponse(resolve, reject, params) {
  return function (err, response) {
    if (err) {
      return resolve({
        status: 200,
        body: []
      });
    }

    if (response.status >= 200 && response.status <= 299) {
      if (response.body.status === '400') {
        return reject({
          status: 400,
          message: response.body.data.content || response.body.data.message
        });
      }

      return resolve({
        status: 200,
        body: response.body
      });
    } else {
      return resolve({
        status: response.statusCode,
        body: response.body
      });
    }
  };
}

module.exports = SicepatAdapter;