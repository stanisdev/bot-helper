module.exports = function(app, config, events, db) {

  app.post('/', function (req, res) {
    var post = req.body;

    if (!(post instanceof Object)) {
      return res.json({
        success: false,
        message: 'Post data does not have any params'
      });
    }

    var paramsExists = {
      'event': post.hasOwnProperty('event'),
      'data': post.hasOwnProperty('data')
    };
    if (!(post instanceof Object) || Object.keys(paramsExists).some(e => !paramsExists[e])) {
      return res.json({
        success: false,
        message: 'Post data does not have required params'
      });
    }
    if (!events.hasOwnProperty(post.event)) {
      return res.json({
        success: false,
        message: 'Event was not recognized'
      });
    }
    events[post.event](post.data, db, function(data) {
      res.json(data);
    });
  });

  app.get('/s', function(req, res) {
    // db.insert('INSERT INTO user_list VALUES (?, ?)', ['778', 1003], function(data) {
    //   console.log(data);
    // });
    db.select('SELECT user_id, event_id FROM user_list WHERE user_id = ?', 778, function(data) {
      console.log(data);
    });
    res.json({});
  });
};
