var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

module.exports = function(config) {

  var connect =  function(cb) {
    var db = new sqlite3.Database(config.db_name);
    db.serialize(function() {
      cb(db);
    });
  }

  var prepare = function(sql, values, cb) {
    connect(function(db) {
      var stmt = db.prepare(sql, function(err) {
        if (err) {
          cb(err);
        }
        stmt.run.apply(stmt, Array.isArray(values) ? values : [values]);
        cb(null, stmt);
      });
    });
  };

  return {
    insert: function(sql, values, cb) {
      prepare(sql, values, function(err, stmt) {
        stmt.finalize(function() {
          cb(null);
        })
      });
    },
    select: function(sql, values, cb) {
      prepare(sql, values, function(err, stmt) {
        stmt.each(function(err, data) {
          cb(data);
        });
      })
    }
  }
};
