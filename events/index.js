var request = require('request');

module.exports = function(config) {

  var events = {};

  /**
   * User/follow
   */
  events['user/follow'] = function(data, cb) {
    console.log('-----------------------');
    console.log(data);
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
    request.post(postData, function(response) {
      if (response.success) {
        var chatData = {
          url: config.api_url + '/chats/' + response.data.id + '/write',
          headers: {
            'X-Namba-Auth-Token': config.token
          },
          body: {
            'type': 'text/plain',
            'content': 'Привет, я твой бот помощник :)'
          }
        };
        request.post(chatData, function() {
          cd({ success: true });
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
