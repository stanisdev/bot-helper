var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

module.exports = function(config, moduleCallback) {

  var instance = {db: null};

  (function(config) {
    var db = new sqlite3.Database(config.db_name);
    db.serialize(function() {
      db.run('CREATE TABLE IF NOT EXISTS user_list (user_id INTEGER, event_id INTEGER)', function(err) {
        if (err) {console.log(err);}
        db.run('CREATE TABLE IF NOT EXISTS user_info (user_id INTEGER, first_name TEXT)', function(err) {
          if (err) {console.log(err);}
          db.run('CREATE TABLE IF NOT EXISTS incorrect_statements (user_id INTEGER, attempts INTEGER)', function(err) {
            instance.db = db;
            moduleCallback();
          });
        });
      });
    });
  })(config);

  var prepare = function(sql, values, cb) {
    var stmt = instance.db.prepare(sql, function(err) {
      if (err) {
        cb(err);
      }
      stmt.run.apply(stmt, Array.isArray(values) ? values : [values]);
      cb(null, stmt);
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
        if (err) {
          console.error(err);
        }
        var resolves = [];
        var p1 = new Promise(function(resolve, reject) {
          resolves.push(resolve);
        });
        var p2 = new Promise(function(resolve, reject) {
          resolves.push(resolve);
        });
        stmt.each(function(err, records) { // Only if there are some data
          resolves[0](records);
        }, function(err, rows) { // Invoke anyway
          if (rows == 0) {
            resolves[0](null);
          }
          resolves[1](rows);
        });
        Promise.all([p1, p2]).then(function(data) {
          cb(data[0]);
        });
      });
    },
    instance: function() {
      return instance.db;
    }
  };
};
