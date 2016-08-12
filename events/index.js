var request = require('request');

module.exports = function(config) {

  var events = {};

  /**
   * User/follow
   */
  events['user/follow'] = function(data, cb) {
    var postData = {
      url: config.api_url + '/chats/create',
      headers: {
        'X-Namba-Auth-Token': config.token
      },
      body: {
        'name': 'Ваш персональный помощник',
        'image': '',
        'members': [data.id]
      },
      json: true
    };
    request.post(postData, function(err, httpResponse, body) {
      if (body.success) {
        var chatData = {
          url: config.api_url + '/chats/' + body.data.id + '/write',
          headers: {
            'X-Namba-Auth-Token': config.token
          },
          body: {
            'type': 'text/plain',
            'content': 'Привет, я твой бот помощник :)'
          },
          json: true
        };
        request.post(chatData, function() {
          console.log('****DONE*****');
          cb({ success: true });
        });
      } else {
        cb({ success: false });
      }
    });
  };

  /**
  * Message/new
  */
  events['message/new'] = function(data, cb) {

  };

  /**
   * Message/update
   */
  events['message/update'] = function(data, cb) {

  };

  /**
   * User/unfollow
   */
  events['user/unfollow'] = function(data, cb) {

  };

  return events;
};
