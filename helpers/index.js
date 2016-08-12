var request = require('request');

module.exports = function(config) {
  return {
    request: function(postData, callback) {

      var data = {
        url: postData.url,
        headers: {
          'X-Namba-Auth-Token': config.token
        },
        body: postData.body,
        json: true
      };
      request.post(data, callback);
    }
  };
};
