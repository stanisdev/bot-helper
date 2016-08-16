var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

module.exports = function(config, moduleCallback) {

  var instance = {db: null};

  (function(config) {
    var db = new sqlite3.Database(config.db_name);
    var queries = [
      'CREATE TABLE IF NOT EXISTS user_list (user_id INTEGER, event_id INTEGER)',
      'CREATE TABLE IF NOT EXISTS user_info (user_id INTEGER, first_name TEXT)',
      'CREATE TABLE IF NOT EXISTS incorrect_statements (user_id INTEGER, attempts INTEGER)',
      'CREATE TABLE IF NOT EXISTS point_out_interests_showed (user_id INTEGER, error_statements_counter INTEGER, showed INTEGER)',
      'CREATE TABLE IF NOT EXISTS interests (user_id INTEGER, interests_list TEXT)'
    ];
    db.serialize(function() {
      async.each(queries, function(query, callback) {
        db.run(query, function(err) {
          if (err) {console.log(err);}
          callback();
        });
      }, function() {
        instance.db = db;
        moduleCallback();
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
