module.exports = function() {
  return {
    root_dir: __dirname,
    port: process.env.PORT || 3000,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIsInBob25lIjoiOTk2NTUyNzg0MDg2IiwicGFzc3dvcmQiOiI3YTgzY2NiZjNiZmFlOGZhOTQyNWZkYWQ0OWNmNjFiMiIsImlhdCI6MTQ3MDk3NTY3N30.6qY9KlL_kgYnx-1hfdZDbgq4RBRVA6RDY38LQGqUzCw',
    api_url: 'http://api.kamp.kg', // 'http://localhost:3000'
    db_name: 'users',
    bot_name: 'Ваш персональный помощник'
  };
};
