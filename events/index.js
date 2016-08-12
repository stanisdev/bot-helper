var request = require('request');

module.exports = function(config) {

  var events = {};
  var helpers = require('./../helpers')(config);

  /**
   * User/follow
   */
  events['user/follow'] = function(data, db, cb) {
    var userId = data.id;

    // Check existing user
    db.select('SELECT user_id, event_id FROM user_list WHERE user_id = ? AND event_id = ?', [userId, 1], function(userExists) {
      return;
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
        if (body.success && !userExists) { // First greeting
          var chatData = {
            url: config.api_url + '/chats/' + body.data.id + '/write',
            headers: {
              'X-Namba-Auth-Token': config.token
            },
            body: {
              'type': 'text/plain',
              'content': 'Привет ' + body.data.name + ', я твой бот помощник :)'
            },
            json: true
          };
          request.post(chatData, function() {
            // Save fact of greeting
            db.insert('INSERT INTO user_list VALUES (?, ?)', [userId, 1], function() {
              cb({ success: true });
            })
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
    console.log('========================================');
    console.log(data.content);
    console.log(data.chat_id);
    console.log('========================================');
    // helpers.request({
    //   url: '',
    //   body: {
    //     'type': 'text/plain',
    //     'content': 'Hello 2'
    //   }
    // }, function() {
    //   cb({success: true});
    // })
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
