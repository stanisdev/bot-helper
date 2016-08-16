module.exports = function() {
  return {
    root_dir: __dirname,
    port: process.env.PORT || 3000,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIsInBob25lIjoiOTk2NTUyNzg0MDg2IiwicGFzc3dvcmQiOiI3YTgzY2NiZjNiZmFlOGZhOTQyNWZkYWQ0OWNmNjFiMiIsImlhdCI6MTQ3MDk3NTY3N30.6qY9KlL_kgYnx-1hfdZDbgq4RBRVA6RDY38LQGqUzCw',
    api_url: process.env.API_URL || 'http://api.kamp.kg',
    db_name: process.env.DB_NAME || 'users7',
    bot_name: 'Ваш персональный помощник',
    hash: '060711473f74be8c62e1b5cebfd7f994d63e4d35338e07b316cb4daff0dc5a3c82024d7b7020b72feb5eb95d8fd84766489f6bd2c97a65482a7664db0b7b60ad',
    username: 'admin',
    secret: 'abcdefg12345'
    // API_URL=http://localhost:3000 DB_NAME=users3 nodemon index.js
  };
};
