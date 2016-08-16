module.exports = function(db, userId, getRand, callback) {
  db.select('SELECT attempts FROM incorrect_statements WHERE user_id = ?', [userId], function(attempts) {
    /**
     * First save
     */
    if (!(attempts instanceof Object)) {
      db.insert('INSERT INTO incorrect_statements VALUES (?, 1)', [userId], function(error) {
        if (!error) {console.log(error);}
        callback();
      });
    } else {
      if (+attempts.attempts >= 2) { // Show hints
        db.insert('DELETE FROM incorrect_statements WHERE user_id = ?', [userId], function(error) {
          if (error) {console.log(error);}
          callback(getHint());
        });
      }
      else { // Increase attempts field
        db.insert('UPDATE incorrect_statements SET attempts = attempts + 1 WHERE user_id = ?', [userId], function(error) {
          if (!error) {console.log(error);}
          callback();
        });
      }
    }
  });

  function getHint() {
    var a = ['Дам тебе подсказку :) ', 'Даю тебе подсказку :) ', 'Вот тебе подсказка :) ', 'Подсказка :) ']
    var b = [
      'какие виды вопросов я понимаю однозначно: ',
      'например, что ты можешь у меня спросить: ',
      'задай мне такого рода вопросы: '
    ];
    var c = [
      'бот, помощь, чат ...',
      'группа, приложения ...',
      'help', 'добрый день', 'kamp',
      'привет',
      'кто ты'
    ];
    var result = '';
  	[a, b, c].forEach(elem => {
    	result += elem[ getRand(elem.length-1) ];
    });
    return result;
  }
};
