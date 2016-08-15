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
  var base = [{
    questions: [
      'кто ты', 'ты кто', 'расскажи о себе', 'who are you'
    ],
    answers: [
      'Я твой персональный друг-помощник, который выручит тебя в любой сложной для тебя ситуации :)',
      'Твой лучший приятель)',
      'Тот, кто выручит тебя в трудную минуту',
      'Я гид и путеводитель по Kamp'
    ]
  }, {
    questions: [
      'help', 'помоги', 'помощь', 'где я', 'что это', 'ау', '!!!'
    ],
    answers: function() {
      var firstMsg = [
        'Начнем с того, что ты находишься в системе Kamp',
        'Итак, отвечу тебе на главный вопрос, что такое Kamp'
      ];
      var secondMsg = [
        'Kamp - это удобное средство общения с друзьями, с ботами при помощи обмена сообщениями через чаты либо через группы',
        'Kamp - возможность пообщаться с друзьями, открыть свою группу, воспользоваться имеющимися приложениями и многое другое'
      ];
      return [
        firstMsg[ getRand(firstMsg.length-1) ],
        secondMsg[ getRand(secondMsg.length-1) ]
      ];
    }
  }, {
    questions: [
      'привет', 'салам', 'салам алейкум', 'hello', 'hey', 'хай', 'добрый день'
    ],
    answers: [
      'Привет, _NAME_'
    ]
  }];

  var getAnswer = function(answer) {
    if (typeof answer == 'function') {
      return callback(answer());
    }
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
  for (var A = 0; A < base.length; A++) {
    for (var B = 0; B < base[A].questions.length; B++) {
      if ((new RegExp('^.?' + base[A].questions[B] + '.?$', 'i')).test(statement)) {
        return getAnswer(base[A].answers);
      }
    }
  }
  getAnswer(exceptions['not recognized']);

  function getRand(max) {
  	var number;
  	while (true) {
        number = +Math.random().toString().substr(2,1);
        if (number <= max) {break;}
      }
    return number;
  }
};
