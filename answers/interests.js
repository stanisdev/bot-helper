module.exports = function(db, userId, callback) {

  db.select('SELECT error_statements_counter, showed FROM point_out_interests_showed WHERE user_id = ?', [userId], function(records) {
    if (!(records instanceof Object)) {
      db.insert('INSERT INTO point_out_interests_showed VALUES (?, 1, 1)', [userId], function(err) {
        if (err) {console.log(err);}
        callback();
      })
    } else {
      // console.log(records); // { error_statements_counter: 10, showed: 1 }
      if (+records.error_statements_counter >= (10 * +records.showed)) {
        db.insert('UPDATE point_out_interests_showed SET error_statements_counter = 0, showed = showed + 1 WHERE user_id = ?', [userId], function(err) {
          if (err) {console.log(err);}
          var text = [
            'Обращаю твое внимание, что ты всегда можешь написать мне свои интересы',
            'Зачем это нужно?:) Так я могу посоветовать тебе то, что ты больше предпочитаешь',
            'Напиши "_интересы_:" и дальше перечисли их через запятую'
          ];
          callback(text);
        })
      } else {
        db.insert('UPDATE point_out_interests_showed SET error_statements_counter = error_statements_counter + 1 WHERE user_id = ?', [userId], function(err) {
          if (err) {console.log(err);}
          callback();
        });
      }
    }
  });
};
