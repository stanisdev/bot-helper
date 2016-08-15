module.exports = function(app, config, events, db) {

  app.post('/chats/create', function(req, res) {
    // console.log(req.body);
    return res.json({
      success: true,
      data: {
        id: 67,
        name: 'Stas'
      }
    });
  });

  app.post('/chats/:id/write', function(req, res) {
    console.log('================');
    console.log(req.body);
    return res.json({
      success: true
    });
  });
};
