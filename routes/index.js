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
};
