module.exports = function(statement, db, userId, callback) {

  var exceptions = {
    none: [
      'Похоже ты забыл задать мне вопрос ;)',
      'Упс, не помешало бы озвучить вопрос!',
      'Увы, друг, но ты не задал вопрос, на который я бы смог тебе ответить'
    ],
    'not recognized': [
      'Увы _NAME_, но я не могу распознать твое обращение ко мне :(',
      'Дорогой мой _NAME_, попробуй сформулировать вопрос иначе'
    ]
  };

  var answers = {
    'кто ты' : [
      'Я твой персональный друг-помощник, который выручит тебя в любой сложной для тебя ситуации :)',
      'Твой лучший приятель)',
      'Тот, кто выручит тебя в трудную минуту...',
      'Гид и путеводитель по Kamp'
    ]
  };

  var getAnswer = function(answer) {
    if (answer.length === 1) {
      return callback(answer[0]);
    }
    var number;
    while (true) {
      number = +Math.random().toString().substr(2,1);
      if (number <= answer.length) {break;}
    }
    (function(result) {
      if (result.search(' _NAME_,') > -1) {
        db.select('SELECT first_name FROM user_info WHERE user_id = ?', [userId], function(userInfo) {
          callback(result.replace(' _NAME_', (userInfo instanceof Object && userInfo.hasOwnProperty('first_name') ? ' ' +userInfo.first_name : '') ));
        });
      } else { callback(result); }
    })(answer[(number === 0 ? 1 : number) - 1])
  };

  if (typeof statement != 'string' || statement.length < 1) {
    return getAnswer(exceptions.none);
  }

  // Find most suitable answer
  for (var key in answers) {
    if ((new RegExp('^.?'+key+'.?$', 'i')).test(statement)) {
      return getAnswer(answers[key]);
    }
  }
  getAnswer(exceptions['not recognized']);
};
