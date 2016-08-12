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

          var sqlite3 = require('sqlite3').verbose();
          var db = new sqlite3.Database('users');

          db.serialize(function() {
            db.run("CREATE TABLE lorem (info TEXT)");

            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();

            db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info);
            });
            db.close();
          });

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
