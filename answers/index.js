module.exports = function(statement, db, userId, callback) {

  var exceptions = {
    none: [
      'Похоже ты забыл задать мне вопрос ;)',
      'Упс, не помешало бы озвучить вопрос!',
      'Увы, друг, но ты не задал вопрос, на который я бы смог тебе ответить'
    ],
    'not recognized': [
      'Увы _NAME_, но я не могу распознать твое обращение ко мне :(',
      'Попробуй сформулировать вопрос иначе',
      'Вынужден тебя попросить адресовать свой вопрос несколько другим образом :)',
      'Я рад что ты продолжаешь общаться со мной :), но эту фразу увы распознать не могу',
      'Эм, неплохо, но лучше если ты задашь свой вопрос по-другому :)'
    ]
  };
  var base = [{
    questions: [
      'кто ты', 'ты кто', 'расскажи о себе', 'who are you'
    ], answers: [
      'Я твой персональный друг-помощник, который выручит тебя в любой сложной для тебя ситуации :)',
      'Твой лучший приятель)',
      'Тот, кто выручит тебя в трудную минуту',
      'Я гид и путеводитель по Kamp'
    ]
  }, {
    questions: [
      'help', 'помоги', 'помощь', 'где я', 'что это', 'ау', '!!!'
    ], answers: function() {
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
      'привет', 'салам', 'салам алейкум', 'hello', 'hey', 'хай', 'добрый день', 'зpдравствуй', 'зpдравствуйте'
    ], answers: {
      invoke: function functionName(callback) {
        var greetings = ['Привет, _NAME_', 'Приветствую, _NAME_', 'Хай, _NAME_', 'Салют, _NAME_', 'Здравствуй, _NAME_']

        findName(userId, function(userInfo) {
          var userInfo = (userInfo instanceof Object && userInfo.hasOwnProperty('first_name') ? ', ' +userInfo.first_name : '');
          callback(greetings[ getRand(greetings.length-1) ].replace(', _NAME_', userInfo));
        });
      }
    }
  }, {
    questions: [
      'группы', 'группа', 'group', 'что такое группа'
    ], answers: [
      'Группа это тематическое объединение постов, внутри которых обсуждются вопросы путем комментирования пользователей'
    ]
  }, {
    questions: [
      'бот', 'bot', 'робот'
    ], answers: [
      'Бот - это виртуальный собеседник, который доносит до тебя желаемую информацию',
    ]
  }, {
    questions: [
      'чат', 'chat', 'чатам'
    ], answers: [
      ['Чат - это приватная область, где ты можешь вести беседу с желаемым для тебя пользователем или пользователями',
      'Чаты могут быть помечены как самоуничтожающиеся через указаное количество времени']
    ]
  }, {
    questions: [
      'приложения', 'аппы', 'апы', 'мини апы', 'мини апппы', 'миниапы', 'миниаппы', 'мини-апы', 'мини-аппы', 'app', 'application'
    ], answers: [
      'Приложения - это небольшие программы, выполняющие какие-либо функции'
    ]
  }, {
    questions: [
      'kamp', 'камп', 'кэмп', 'кемп', 'kamp.kg'
    ], answers: [
      'KAMP - это локальный мобильный портал твоего города'
    ]
  }];

  var getAnswer = function(answer) {
    if (typeof answer == 'function') {
      return callback(answer());
    }
    if (!Array.isArray() && answer instanceof Object && answer.hasOwnProperty('invoke')) {
      return answer.invoke(callback);
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
        findName(userId, function(userInfo) {
          var userInfo = (userInfo instanceof Object && userInfo.hasOwnProperty('first_name') ? ' ' +userInfo.first_name : '');
          callback(result.replace(' _NAME_', userInfo));
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
  // If we are here then statement was not recognized. Save this fact and after 2 attempt to send hint
  require('./hint')(db, userId, getRand, function(hints) {
    if (hints) {
      callback([
        exceptions['not recognized'][ getRand( exceptions['not recognized'].length-1 ) ],
        hints
      ]);
    } else {getAnswer(exceptions['not recognized']);}
  });

  function getRand(max) {
  	var number;
  	while (true) {
        number = +Math.random().toString().substr(2,1);
        if (number <= max) {break;}
      }
    return number;
  }

  function findName(userId, callback) {
    db.select('SELECT first_name FROM user_info WHERE user_id = ?', [userId], function(userInfo) {
      callback(userInfo);
    });
  }
};
