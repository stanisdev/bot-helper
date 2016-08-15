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
      helpers.request({
        url: config.api_url + '/chats/create',
        body: {
          'name': config.bot_name,
          'image': '',
          'members': [userId]
        }
      }, function(error, httpResponse, body) {
        if (body.success && !userExists) { // First greeting

          async.eachSeries(['Привет ' + body.data.name + ', я твой бот помощник.', 'В любой непонятной ситуации обращайся ко мне :)'], function(element, callback) {
            helpers.request({
              url: config.api_url + '/chats/' + body.data.id + '/write',
              body: {
                'type': 'text/plain',
                'content': element
              }
            }, function(error, response, body) {
              if (error) {console.log(error);}
              callback(null);
            });
          }, function(err, result) { // Save fact of greeting
            db.insert('INSERT INTO user_list VALUES (?, ?)', [userId, 1], function() {
              // Save name of user
              console.log('=========================');
              console.log(body.data.name);
              console.log('=========================');
              db.insert('INSERT INTO user_info VALUES (?, ?)', [userId, body.data.name], function() {
                cb({ success: true });
              });
            });
          });

        } else if(body.success && userExists) { // Reinclusion bot
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
    var statement = data.content;
    require('./../answers')(statement.trim().toLowerCase(), db, 27, function(answer) {
      async.eachSeries(Array.isArray(answer) ? answer : [answer], function(element, callback) { // Asyncroniously response answer
        helpers.request({
          url: config.api_url + '/chats/' + data.chat_id + '/write',
          body: {
            'type': 'text/plain',
            'content': element
          }
        }, function(error, response, body) {
          if (error) {console.log(error);}
          callback(null);
        });
      }, function(err, result) {
        cb({success: true});
      });
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
