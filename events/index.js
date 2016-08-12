var request = require('request');

module.exports = function(config) {

  var events = {};

  /**
   * User/follow
   */
  events['user/follow'] = function(data, db, cb) {
    var userId = data.id;

    // Check existing user
    db.select('SELECT user_id, event_id FROM user_list WHERE user_id = ?', [userId, 1], function(userExists) {
      console.log('=======================');
      console.log(userExists);

      var postData = {
        url: config.api_url + '/chats/create',
        headers: {
          'X-Namba-Auth-Token': config.token
        },
        body: {
          'name': config.bot_name,
          'image': '',
          'members': [userId]
        },
        json: true
      };
      request.post(postData, function(err, httpResponse, body) {
        if (body.success && !userExists) {
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
            cb({ success: true });
          });
        } else if(body.success && userExists) {
          cb({ success: true });
        } else {
          cb({ success: false });
        }
      });
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
