var express = require('express');
var router = express.Router();
var path = require('path');
var mime = require('mime');
var fs = require('fs');

module.exports = function(app, config, events, db, passport) {

  /**
   * Index
   */
  router.get('/', passport.authenticate('basic', { session: false }), function(req, res) {
    res.render('admin/index.html');
  });

  /**
   * Download
   */
  router.get('/download', passport.authenticate('basic', { session: false }), function(req, res) {
    var file = config.root_dir + '/' + config.db_name;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  });

  app.use('/admins2', router);
};
