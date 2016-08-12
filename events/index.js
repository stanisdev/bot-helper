var request = require('request');
var async = require('async');

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
  events['message/new'] = function(data, db, cb) {
    // data.content
    async.each(['One', 'Two', 'Three', 'Four', 'Five'], function(element, callback) {
      helpers.request({
        url: config.api_url + '/chats/' + data.chat_id + '/write',
        body: {
          'type': 'text/plain',
          'content': element
        }
      }, function(error, response, body) {
        console.log(body.data.content);
        callback(null);
      })
    }, function(err, result) {
      cb({success: true});
    });
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
